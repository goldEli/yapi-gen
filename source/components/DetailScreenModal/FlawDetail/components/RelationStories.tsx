/* eslint-disable no-undefined */
import {
  addFlawRelation,
  deleteFlawRelation,
  flawRelationDragSort,
  getFlawRelationStories,
  getFlawSelectRelationRecent,
  getFlawSelectRelationSearch,
  updateFlawPriority,
  updateFlawStatus,
} from '@/services/flaw'
import { getParamsData } from '@/tools'
import MoreOptions from '@/components/MoreOptions'
import { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FormWrap,
  Label,
  LabelWrap,
  PriorityWrap,
  RelationWrap,
} from '../style'
import CommonButton from '@/components/CommonButton'
import ResizeTable from '@/components/ResizeTable'
import NoData from '@/components/NoData'
import PaginationBox from '@/components/TablePagination'
import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import { Form, Tooltip, Select } from 'antd'
import { useSelector } from '@store/index'
import { getMessage } from '@/components/Message'
import Sort from '@/components/Sort'
import { useTranslation } from 'react-i18next'
import ChangeStatusPopover from '@/components/ChangeStatusPopover'
import StateTag from '@/components/StateTag'
import ChangePriorityPopover from '@/components/ChangePriorityPopover'
import { CloseWrap, HiddenText, TableBorder } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import TableQuickEdit from '@/components/TableQuickEdit'
import MultipleAvatar from '@/components/MultipleAvatar'
import { OmitText } from '@star-yun/ui'
import MoreDropdown from '@/components/MoreDropdown'
import RelationDropdownMenu from '@/components/TableDropdownMenu/RelationDropdownMenu'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import DragTable from '@/components/DragTable'
import styled from '@emotion/styled'
import CommonIconFont from '@/components/CommonIconFont'
import CommonProgress from '@/components/CommonProgress'
export const SubLabel = styled.div`
  margin: 8px 0;
  font-size: 12px;
  color: var(--neutral-n3);
`

interface RelationStoriesProps {
  activeKey?: string
  detail: Model.Flaw.FlawInfo
  isOpen?: boolean
  onUpdate(value?: boolean): void
  isDrawer?: boolean
  isPreview?: boolean
}

interface SelectItem {
  label: string
  value: number
}

const RelationStories = (props: RelationStoriesProps, ref: any) => {
  const [t] = useTranslation()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const { projectInfo } = useSelector(store => store.project)
  const paramsData = getParamsData(searchParams) ?? {}
  const { id } = paramsData ?? { id: projectInfo.id }

  const [searchValue, setSearchValue] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [pageObj, setPageObj] = useState({ page: 1, size: 20 })
  const [isSpinning, setIsSpinning] = useState(false)
  const [isShowMore, setIsShowMore] = useState(false)
  const [dataSource, setDataSource] =
    useState<Model.Flaw.FlawRelationStoriesData>()
  const [allDataSource, setAllDataSource] = useState<any>({
    list: undefined,
  })
  const [resultData, setResultData] = useState<
    {
      label: string
      value: number
      list: Model.Affairs.AffairsInfo[]
    }[]
  >([])

  // 项目是否已经结束
  const isEnd = projectInfo?.status === 2

  //根据搜索框的值来放的数据
  const [options, setOptions] = useState<any>([])
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) => i.identity === 'b/flaw/update',
    )?.length > 0

  // 类型列表
  const typeList = [
    { label: t('associate'), value: 1, list: [] },
    { label: t('front'), value: 2, list: [] },
    { label: t('rear'), value: 3, list: [] },
    { label: t('block'), value: 4, list: [] },
    { label: t('blocked'), value: 5, list: [] },
  ]

  //   获取关联项列表
  const getList = async (pageParams: any, orderParams: any) => {
    setIsSpinning(true)
    const response = await getFlawRelationStories({
      projectId: id ?? props.detail.projectId,
      id: props.detail.id,
      order: orderParams.value,
      orderKey: orderParams.key,
      page: pageParams.page,
      pageSize: pageParams.size,
    })
    setDataSource(response)
    setAllDataSource(response)
    const newArr = JSON.parse(JSON.stringify(typeList))
    newArr.forEach((element: any) => {
      response.list.forEach((i: any) => {
        if (i.relation_type === element.value) {
          element.list.push({ ...i, index: i.id })
        }
      })
    })
    setResultData(newArr)
    setIsSpinning(false)
  }

  // 获取关联事务下拉列表
  const getSelectRelationSearch = async (value: string) => {
    const response = await getFlawSelectRelationSearch({
      projectId: projectInfo.id,
      id: props.detail.id,
      searchValue: value,
    })
    setOptions(
      response.map((i: any) => ({
        label: i.story_prefix_key,
        labelName: i.name,
        value: i.id,
        id: i.id,
        cover: i?.project_category?.attachment_path,
      })),
    )
  }

  // 获取最近关联事务下拉列表
  const getSelectRelationRecent = async () => {
    const response = await getFlawSelectRelationRecent({
      projectId: projectInfo.id,
      id: props.detail.id,
    })
    setOptions(
      response.map((i: Model.Flaw.FlawInfo) => ({
        label: i.story_prefix_key,
        labelName: i.name,
        value: i.id,
        id: i.id,
        cover: i.project_category.attachment_path,
      })),
    )
  }

  // 点击添加链接事务弹窗
  const onClickOpen = () => {
    setIsVisible(true)
  }
  useImperativeHandle(ref, () => {
    return {
      onClickOpen,
    }
  })
  const onSearch = (value: string) => {
    setSearchValue(value)
    if (value) {
      getSelectRelationSearch(value)
    }
  }

  // 关闭链接事务弹窗
  const onClose = () => {
    setSearchValue('')
    setIsVisible(false)
    form.resetFields()
  }

  // 提交链接事务表单
  const onConfirm = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    await addFlawRelation({
      ...values,
      projectId: projectInfo.id,
      id: props.detail.id,
    })
    getMessage({ type: 'success', msg: t('addedSuccessfully') })
    getList(pageObj, order)
    onClose()
    props.onUpdate()
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
    await updateFlawPriority({
      id: item.id,
      priorityId: item.priorityId,
      projectId: id,
    })
    getMessage({ msg: t('common.prioritySuccess'), type: 'success' })
    getList(pageObj, order)
  }

  //   修改状态
  const onChangeStatus = async (value: any) => {
    await updateFlawStatus(value)
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

  // 删除关联确认事件
  const onDeleteConfirm = async (item: any) => {
    await deleteFlawRelation({
      project_id: id,
      id: props.detail.id,
      relation_id: item.id,
      type: item.relation_type,
    })
    getMessage({ type: 'success', msg: t('successfullyDeleted') })
    onUpdate()
  }

  // 删除关联任务
  const onDeleteChange = (item: any) => {
    setIsShowMore(false)
    open({
      title: t('deleteConfirmation'),
      text: t('areYouSureYouWantToDeleteThisAssociatedWork'),
      onConfirm() {
        onDeleteConfirm(item)
        return Promise.resolve()
      },
    })
  }

  const columns = [
    {
      width: 40,
      render: (text: any, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MoreDropdown
              isMoreVisible={isShowMore}
              menu={
                <RelationDropdownMenu
                  onDeleteChange={onDeleteChange}
                  record={record}
                  type={2}
                />
              }
              onChangeVisible={setIsShowMore}
            />
          </div>
        )
      },
    },
    {
      title: <NewSort fixedKey="story_prefix_key">{t('serialNumber')}</NewSort>,
      dataIndex: 'story_prefix_key',
      width: 140,
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: (
        <NewSort fixedKey="relation_type">{t('connectionRelation')}</NewSort>
      ),
      width: 140,
      dataIndex: 'relation_type',
      render: (text: string) => (
        <div>{typeList.filter((i: any) => i.value === text)[0]?.label}</div>
      ),
    },
    {
      title: <NewSort fixedKey="name">{t('common.title')}</NewSort>,
      dataIndex: 'name',
      width: 400,
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
      dataIndex: 'iteration',
      key: 'iterate_name',
      width: 100,
      render: (text: string, record: any) => {
        return (
          <TableQuickEdit
            type="fixed_radio"
            defaultText={text}
            keyText="iterate_id"
            item={record}
            onUpdate={onUpdate}
            isBug
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
      width: 100,
      render: (text: any, record: Record<string, string | number>) => {
        return (
          <ChangePriorityPopover
            isCanOperation={
              isCanEdit &&
              Object.keys(record.categoryConfigList).includes('priority')
            }
            onChangePriority={item => onChangeState(item)}
            record={{ project_id: id, id: record.id }}
          >
            <PriorityWrap isShow={isCanEdit}>
              {text?.icon && (
                <>
                  <IconFont
                    className="priorityIcon"
                    type={text?.icon}
                    style={{
                      fontSize: 20,
                      color: text?.color,
                    }}
                  />
                  <span>{text.content_txt}</span>
                </>
              )}
              <span style={{ marginLeft: '5px' }}>
                {!text?.icon && <span>--</span>}
                <IconFont
                  style={{ color: 'var(--neutral-n4)' }}
                  className="icon"
                  type="down-icon"
                />
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
      width: 170,
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
      width: 140,
      render: (text: any, record: any) => {
        return (
          <TableQuickEdit
            type="fixed_select"
            defaultText={record?.usersInfo?.map((i: any) => i.id) || []}
            keyText="users"
            item={record}
            onUpdate={onUpdate}
            isBug
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
    {
      title: <NewSort fixedKey="schedule">{t('situation.progress')}</NewSort>,
      dataIndex: 'schedule',
      key: 'schedule',
      width: 120,
      render: (text: string, record: any) => {
        return (
          <div>
            <CommonProgress
              isTable
              percent={Number(text)}
              id={record.id}
              project_id={record.project_id}
            />
          </div>
        )
      },
    },
  ]

  const drawerColumns = [
    {
      title: <NewSort fixedKey="story_prefix_key">{t('serialNumber')}</NewSort>,
      dataIndex: 'story_prefix_key',
      width: 140,
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: <NewSort fixedKey="name">{t('common.title')}</NewSort>,
      dataIndex: 'name',
      width: 160,
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
      title: <NewSort fixedKey="priority">{t('common.priority')}</NewSort>,
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (text: any, record: Record<string, string | number>) => {
        return (
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
        )
      },
    },

    {
      title: t('common.dealName'),
      dataIndex: 'handlers',
      key: 'handlers',
      width: 100,
      render: (text: any, record: any) => {
        return (
          <>
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
          </>
        )
      },
    },
    {
      title: <NewSort fixedKey="status">{t('common.status')}</NewSort>,
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text: any, record: any) => {
        return (
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
        )
      },
    },
    {
      title: <NewSort fixedKey="schedule">{t('situation.progress')}</NewSort>,
      dataIndex: 'schedule',
      key: 'schedule',
      width: 120,
      render: (text: string, record: any, index: any) => {
        return (
          <div>
            <CommonProgress
              project_id={record.project_id}
              isTable
              percent={Number(text)}
              id={record.id}
            />
          </div>
        )
      },
    },
  ]

  // 改变顺序
  const onChangeData = async (
    item: any,
    data: { list: Model.Flaw.FlawInfo[] },
  ) => {
    setResultData(
      resultData.map((i: any) => ({
        ...i,
        list: item.value === i.value ? data.list : i.list,
      })),
    )
    await flawRelationDragSort({
      projectId: projectInfo.id,
      id: props.detail.id,
      relationIds: data.list.map((i: Model.Flaw.FlawInfo) => i.id),
      type: item.value,
    })
  }

  const operationList = [
    {
      width: 40,
      render: (text: any, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MoreDropdown
              isMoreVisible={isShowMore}
              hasChild
              menu={
                <RelationDropdownMenu
                  onDeleteChange={onDeleteChange}
                  record={record}
                  type={2}
                />
              }
              onChangeVisible={setIsShowMore}
            />
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    if (props.activeKey === '2' || props.detail?.id) {
      getList(pageObj, order)
    }
  }, [props.detail])
  useEffect(() => {
    if (isVisible && !searchValue) {
      getSelectRelationRecent()
    }
  }, [searchValue, isVisible])
  const onSelect = (value: any) => {
    form.setFieldsValue({
      relationId: value,
    })
  }
  return (
    <RelationWrap
      style={{
        padding: props.isDrawer ? '16px 24px' : 24,
        // height: props.isDrawer
        //   ? '100%'
        //   : isEnd
        //   ? 'calc(100vh - 192px)'
        //   : 'calc(100vh - 224px)',
        backgroundColor: 'white',
        marginTop: '12px',
      }}
      id="tab_associatedWorkItems"
      className="info_item_tab"
    >
      <DeleteConfirmModal />
      <CommonModal
        isVisible={isVisible}
        title={t('linkWorkItem')}
        onClose={onClose}
        confirmText={t('link')}
        onConfirm={onConfirm}
      >
        <FormWrap layout="vertical" form={form} style={{ padding: '0 24px' }}>
          <Form.Item
            label={t('linkType')}
            name="type"
            rules={[{ required: true, message: '' }]}
          >
            <CustomSelect
              placeholder={t('pleaseChooseTheType')}
              getPopupContainer={(node: any) => node}
              options={typeList}
              showArrow
              optionFilterProp="label"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label={t('workItem')}
            name="relationId"
            rules={[{ required: true, message: '' }]}
          >
            <CustomSelect
              onSearch={onSearch}
              allowClear
              showArrow
              onClear={() => []}
              getPopupContainer={(node: any) => node}
              showSearch
              onSelect={onSelect}
              placeholder={t('searchForWorkItems')}
              optionFilterProp="label"
            >
              {options?.map((i: any) => {
                return (
                  <Select.Option
                    value={i.value}
                    key={i.value}
                    label={i.labelName}
                  >
                    <MoreOptions
                      type="project"
                      name={i.label}
                      labelName={i.labelName}
                      img={i.cover}
                    />
                  </Select.Option>
                )
              })}
            </CustomSelect>
          </Form.Item>
        </FormWrap>
      </CommonModal>
      {props.isDrawer ? (
        <LabelWrap>
          <Label>{t('linkWorkItem')}</Label>
          {!props?.isPreview && (
            <Tooltip title={t('linkTask')}>
              <CloseWrap width={32} height={32}>
                <CommonIconFont
                  type="plus"
                  size={20}
                  color="var(--neutral-n2)"
                  onClick={onClickOpen}
                />
              </CloseWrap>
            </Tooltip>
          )}
        </LabelWrap>
      ) : (
        <CommonButton type="primaryText" icon="plus" onClick={onClickOpen}>
          {t('linkWorkItem')}
        </CommonButton>
      )}

      {/* 缺陷详情 */}
      {!props.isDrawer && (
        <>
          <ResizeTable
            isSpinning={isSpinning}
            dataWrapNormalHeight="calc(100% - 83px)"
            col={props.isDrawer ? drawerColumns : columns}
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
        </>
      )}
      {/* 缺陷浮层 */}
      {props.isDrawer && (
        <>
          {resultData.map((i: any) => (
            <>
              {i.list.length > 0 && (
                <div key={i.value}>
                  <SubLabel>{i.label}</SubLabel>
                  <TableBorder>
                    <DragTable
                      columns={drawerColumns}
                      dataSource={{ list: i.list }}
                      onChangeData={arr => onChangeData(i, arr)}
                      showHeader={false}
                      hasOperation={operationList}
                    />
                  </TableBorder>
                </div>
              )}
            </>
          ))}
          {allDataSource.list?.length <= 0 && <NoData />}
        </>
      )}
    </RelationWrap>
  )
}

export default forwardRef(RelationStories)
