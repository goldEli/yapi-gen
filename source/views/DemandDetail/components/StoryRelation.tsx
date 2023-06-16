/* eslint-disable no-undefined */
import { getParamsData } from '@/tools'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CommonButton from '@/components/CommonButton'
import ResizeTable from '@/components/ResizeTable'
import NoData from '@/components/NoData'
import PaginationBox from '@/components/TablePagination'
import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import { Form, Tooltip } from 'antd'
import { useSelector } from '@store/index'
import { getMessage } from '@/components/Message'
import Sort from '@/components/Sort'
import { useTranslation } from 'react-i18next'
import ChangeStatusPopover from '@/components/ChangeStatusPopover'
import StateTag from '@/components/StateTag'
import ChangePriorityPopover from '@/components/ChangePriorityPopover'
import { HiddenText } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import TableQuickEdit from '@/components/TableQuickEdit'
import MultipleAvatar from '@/components/MultipleAvatar'
import { OmitText } from '@star-yun/ui'
import styled from '@emotion/styled'
import {
  addStoryRelation,
  getStoryRelationStories,
  getStorySelectRelationRecent,
  getStorySelectRelationSearch,
  updateDemandStatus,
  updatePriority,
} from '@/services/demand'

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '22px 0 0 0',
  },
})

const RelationWrap = styled.div`
  height: 100%;
`

const PriorityWrap = styled.div<{ isShow?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    div: {
      color: 'var(--neutral-n1-d2)',
      fontSize: 14,
      marginLeft: 8,
    },
    '.icon': {
      marginLeft: 8,
      visibility: 'hidden',
      fontSize: 14,
      color: 'var(--neutral-n4)',
    },
    '.priorityIcon': {
      fontSize: 14,
    },
  },
  ({ isShow }) => ({
    cursor: isShow ? 'pointer' : 'inherit',
    '&: hover': {
      '.icon': {
        visibility: isShow ? 'visible' : 'hidden',
      },
    },
  }),
)

interface RelationStoriesProps {
  activeKey?: string
  detail: Model.Flaw.FlawInfo
  isOpen?: boolean
  onUpdate?(): void
  isDrawer?: boolean
}

interface SelectItem {
  label: string
  value: number
}

const StoryRelation = (props: RelationStoriesProps) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, demandId } = paramsData
  const { projectInfo } = useSelector(store => store.project)
  const [searchValue, setSearchValue] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [pageObj, setPageObj] = useState({ page: 1, size: 20 })
  const [isSpinning, setIsSpinning] = useState(false)
  const [dataSource, setDataSource] =
    useState<Model.Flaw.FlawRelationStoriesData>()
  // 下拉数据
  const [selectList, setSelectList] = useState<SelectItem[]>([])
  // 最近事务数据
  const [recentList, setRecentList] = useState<SelectItem[]>([])

  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter((i: any) =>
      projectInfo.projectType === 1 ? 'b/story/update' : 'b/transaction/update',
    )?.length > 0

  // 类型列表
  const typeList = [
    { label: '关联', value: 1 },
    { label: '前置', value: 2 },
    { label: '后置', value: 3 },
    { label: '阻塞', value: 4 },
    { label: '被阻塞', value: 5 },
    { label: '克隆', value: 6 },
  ]

  //   获取关联项列表
  const getList = async (pageParams: any, orderParams: any) => {
    setIsSpinning(true)
    const response = await getStoryRelationStories({
      projectId: id,
      id: props.detail.id,
      order: orderParams.value,
      orderKey: orderParams.key,
      page: pageParams.page,
      pageSize: pageParams.size,
    })
    setDataSource(response)
    setIsSpinning(false)
  }

  // 获取关联事务下拉列表
  const getSelectRelationSearch = async (value: string) => {
    const response = await getStorySelectRelationSearch({
      projectId: projectInfo.id,
      id: props.detail.id,
      searchValue: value,
    })

    setSelectList(
      response.map((i: Model.Flaw.FlawInfo) => ({
        label: i.name,
        value: i.id,
      })),
    )
  }

  // 获取最近关联事务下拉列表
  const getSelectRelationRecent = async () => {
    const response = await getStorySelectRelationRecent({
      projectId: projectInfo.id,
      id: props.detail.id,
    })
    setRecentList(
      response.map((i: Model.Flaw.FlawInfo) => ({
        label: i.name,
        value: i.id,
      })),
    )
  }

  // 点击添加链接事务弹窗
  const onClickOpen = () => {
    setIsVisible(true)
    getSelectRelationRecent()
  }

  const onSearch = (value: string) => {
    setSearchValue(value)
    if (value) {
      getSelectRelationSearch(value)
    }
  }

  // 关闭链接事务弹窗
  const onClose = () => {
    setIsVisible(false)
    form.resetFields()
  }

  // 提交链接事务表单
  const onConfirm = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    await addStoryRelation({
      ...values,
      projectId: projectInfo.id,
      id: props.detail.id,
    })
    getMessage({ type: 'success', msg: '添加成功' })
    getList(pageObj, order)
    onClose()
    props.onUpdate?.()
  }

  // 点击切换页码
  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order)
  }

  const onChangeKey = (key: any, val: any) => {
    setOrder({ value: val, key })
    getList(pageObj, { value: val, key })
  }

  //   修改优先级
  const onChangeState = async (item: any) => {
    await updatePriority({
      id: item.id,
      priorityId: item.priorityId,
      projectId: id,
    })
    getMessage({ msg: t('common.prioritySuccess'), type: 'success' })
    getList(pageObj, order)
  }

  //   修改状态
  const onChangeStatus = async (value: any) => {
    await updateDemandStatus(value)
    getMessage({ msg: t('common.statusSuccess'), type: 'success' })
    getList(pageObj, order)
  }

  //   更新
  const onUpdate = () => {
    getList(pageObj, order)
  }

  const onExamine = () => {
    getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
  }

  const NewSort = (props: any) => {
    return (
      <Sort
        fixedKey={props.fixedKey}
        onChangeKey={onChangeKey}
        nowKey={order.orderKey}
        order={order.value}
      >
        {props.children}
      </Sort>
    )
  }

  const columns = [
    {
      title: <NewSort fixedKey="story_prefix_key">{t('serialNumber')}</NewSort>,
      dataIndex: 'story_prefix_key',
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: <NewSort fixedKey="relation_type">关联关系</NewSort>,
      dataIndex: 'relation_type',
      render: (text: number) => (
        <div>{typeList.filter((i: any) => i.value === text)[0]?.label}</div>
      ),
    },
    {
      title: <NewSort fixedKey="name">标题</NewSort>,
      dataIndex: 'name',
      render: (text: any, record: Model.Flaw.FlawInfo) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Tooltip
            placement="top"
            getPopupContainer={node => node}
            title={text.name}
          >
            <img
              src={record.category_attachment}
              style={{
                width: '18px',
                height: '18px',
                marginRight: '8px',
              }}
              alt=""
            />
          </Tooltip>

          {record.name}
        </div>
      ),
    },
    {
      title: <NewSort fixedKey="iterate_name">{t('common.iterate')}</NewSort>,
      dataIndex: 'iterate_name',
      key: 'iterate_name',
      width: 120,
      render: (text: string, record: any) => {
        return (
          <TableQuickEdit
            type="fixed_radio"
            defaultText={text}
            keyText="iterate_id"
            item={record}
            onUpdate={onUpdate}
          >
            <HiddenText>
              <OmitText
                width={120}
                tipProps={{
                  getPopupContainer: node => node,
                }}
              >
                {text || '--'}
              </OmitText>
            </HiddenText>
          </TableQuickEdit>
        )
      },
    },
    {
      title: <NewSort fixedKey="priority">{t('common.priority')}</NewSort>,
      dataIndex: 'priority',
      key: 'priority',
      width: 180,
      render: (text: any, record: Record<string, string | number>) => {
        return (
          <ChangePriorityPopover
            isCanOperation={
              isCanEdit &&
              Object.keys(record.categoryConfigList).includes('priority')
            }
            onChangePriority={item => onChangeState(item)}
            record={{ project_id: id, id: props.detail.id }}
          >
            <PriorityWrap isShow={isCanEdit}>
              {text?.icon && (
                <IconFont
                  className="priorityIcon"
                  type={text?.icon}
                  style={{
                    fontSize: 20,
                    color: text?.color,
                  }}
                />
              )}
              <span style={{ marginLeft: '5px' }}>
                {!text?.icon && <span>--</span>}
                <IconFont className="icon" type="down-icon" />
              </span>
            </PriorityWrap>
          </ChangePriorityPopover>
        )
      },
    },
    {
      title: <NewSort fixedKey="status">{t('common.status')}</NewSort>,
      dataIndex: 'status',
      key: 'status',
      width: 190,
      render: (text: any, record: any) => {
        return (
          <ChangeStatusPopover
            isCanOperation={isCanEdit && !record.isExamine}
            projectId={id}
            record={record}
            onChangeStatus={item => onChangeStatus(item)}
            type={3}
          >
            <StateTag
              onClick={record.isExamine ? onExamine : void 0}
              isShow={isCanEdit || record.isExamine}
              name={record.status.status.content}
              state={
                text?.is_start === 1 && text?.is_end === 2
                  ? 1
                  : text?.is_end === 1 && text?.is_start === 2
                  ? 2
                  : text?.is_start === 2 && text?.is_end === 2
                  ? 3
                  : 0
              }
            />
          </ChangeStatusPopover>
        )
      },
    },
    {
      title: t('common.dealName'),
      dataIndex: 'handlers',
      key: 'handlers',
      width: 180,
      render: (text: any, record: any) => {
        return (
          <TableQuickEdit
            type="fixed_select"
            defaultText={record?.usersNameIds || []}
            keyText="users"
            item={record}
            onUpdate={onUpdate}
          >
            {record?.usersInfo.length > 0 && (
              <MultipleAvatar
                max={3}
                list={
                  record?.usersInfo?.map((i: any) => ({
                    id: i.id,
                    name: i.name,
                    avatar: i.avatar,
                  })) || []
                }
              />
            )}
            {!record?.usersInfo?.length && '--'}
          </TableQuickEdit>
        )
      },
    },
  ]

  useEffect(() => {
    if (props.activeKey === '3' || props.isOpen) {
      getList(pageObj, order)
    }
  }, [props.activeKey, props.isOpen])

  return (
    <RelationWrap
      style={{ height: props.isDrawer ? '100%' : 'calc(100vh - 227px)' }}
    >
      <CommonModal
        isVisible={isVisible}
        title="链接工作项"
        onClose={onClose}
        confirmText="链接"
        onConfirm={onConfirm}
      >
        <FormWrap layout="vertical" form={form} style={{ padding: '0 24px' }}>
          <Form.Item
            label="链接类型"
            name="type"
            rules={[{ required: true, message: '' }]}
          >
            <CustomSelect
              placeholder="请选择类型"
              getPopupContainer={(node: any) => node}
              options={typeList}
              showArrow
              optionFilterProp="label"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="工作项"
            name="relationId"
            rules={[{ required: true, message: '' }]}
          >
            <CustomSelect
              placeholder="请选择工作项"
              getPopupContainer={(node: any) => node}
              showArrow
              optionFilterProp="label"
              allowClear
              showSearch
              onSearch={onSearch}
              options={searchValue ? selectList : recentList}
            />
          </Form.Item>
        </FormWrap>
      </CommonModal>
      <CommonButton type="primaryText" icon="plus" onClick={onClickOpen}>
        链接工作项
      </CommonButton>
      <ResizeTable
        isSpinning={isSpinning}
        dataWrapNormalHeight="calc(100% - 94px)"
        col={columns}
        dataSource={dataSource?.list}
        noData={<NoData />}
      />
      <PaginationBox
        currentPage={dataSource?.pager?.page || 0}
        pageSize={pageObj?.size}
        total={dataSource?.pager?.total || 0}
        onChange={onChangePage}
        hasPadding
      />
    </RelationWrap>
  )
}

export default StoryRelation
