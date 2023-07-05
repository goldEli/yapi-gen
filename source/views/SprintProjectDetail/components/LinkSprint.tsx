/* eslint-disable no-undefined */
import CommonButton from '@/components/CommonButton'
import { InfoItem, InfoItemWrap, Label, SubLabel } from '../style'
import { useEffect, useState } from 'react'
import StateTag from '@/components/StateTag'
import DragTable from '@/components/DragTable'
import CommonModal from '@/components/CommonModal'
import { Form, Select, Tooltip } from 'antd'
import CustomSelect from '@/components/CustomSelect'
import styled from '@emotion/styled'
import MultipleAvatar from '@/components/MultipleAvatar'
import CommonIconFont from '@/components/CommonIconFont'
import { useSelector } from '@store/index'
import {
  addAffairsRelation,
  affairsRelationDragSort,
  deleteAffairsRelation,
  getAffairsRelationStoriesList,
  getAffairsSelectRelationRecent,
  getAffairsSelectRelationSearch,
} from '@/services/affairs'
import { getMessage } from '@/components/Message'
import PaginationBox from '@/components/TablePagination'
import MoreDropdown from '@/components/MoreDropdown'
import RelationDropdownMenu from '@/components/TableDropdownMenu/RelationDropdownMenu'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { PriorityWrapTable } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import NoData from '@/components/NoData'

const FormWrap = styled(Form)`
  padding: 0 24px;
  height: 160px;
`

interface SelectItem {
  label: string
  value: number
}

const LinkSprint = (props: { detail: Model.Affairs.AffairsInfo }) => {
  const [isShowMore, setIsShowMore] = useState(false)
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const [form] = Form.useForm()
  const [isVisible, setIsVisible] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { projectInfo } = useSelector(store => store.project)
  const [pageParams, setPageParams] = useState({ page: 1, pagesize: 20 })
  // 下拉数据
  const [selectList, setSelectList] = useState<SelectItem[]>([])
  // 最近事务数据
  const [recentList, setRecentList] = useState<SelectItem[]>([])
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

  const columns = [
    {
      title: '',
      dataIndex: 'story_prefix_key',
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: '',
      dataIndex: 'project_category',
      render: (text: any, record: Model.Affairs.AffairsInfo) => (
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
              src={text.attachment_path}
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
      title: '',
      dataIndex: 'story_config_priority',
      render: (text: any) => (
        <PriorityWrapTable isShow={false}>
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
        </PriorityWrapTable>
      ),
    },
    {
      title: '',
      dataIndex: 'handlers',
      render: (text: any) => (
        <>
          {text?.length > 0 && <MultipleAvatar max={3} list={text ?? []} />}
          {text?.length <= 0 && '--'}
        </>
      ),
    },
    {
      title: '',
      dataIndex: 'category_status',
      render: (text: any) => (
        <StateTag
          name={text.status_name}
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
      ),
    },
  ]

  // 删除关联确认事件
  const onDeleteConfirm = async (item: any) => {
    await deleteAffairsRelation({
      project_id: projectInfo.id,
      id: props.detail.id,
      relation_id: item.id,
      type: item.relation_type,
    })
    getMessage({ type: 'success', msg: '删除成功' })
    getRelationStoriesList(pageParams)
  }

  // 删除关联工作项
  const onDeleteChange = (item: any) => {
    setIsShowMore(false)
    open({
      title: '删除确认',
      text: '确认删除链接事务？',
      onConfirm() {
        onDeleteConfirm(item)
        return Promise.resolve()
      },
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
                />
              }
              onChangeVisible={setIsShowMore}
            />
          </div>
        )
      },
    },
  ]

  // 类型列表
  const typeList = [
    { label: '关联', value: 1, list: [] },
    { label: '前置', value: 2, list: [] },
    { label: '后置', value: 3, list: [] },
    { label: '阻塞', value: 4, list: [] },
    { label: '被阻塞', value: 5, list: [] },
  ]

  // 获取关联事务列表
  const getRelationStoriesList = async (page: {
    page: number
    pagesize: number
  }) => {
    const response = await getAffairsRelationStoriesList({
      projectId: projectInfo.id,
      id: props.detail.id,
      ...page,
    })
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
  }

  // 获取关联事务下拉列表
  const getSelectRelationSearch = async (value: string) => {
    const response = await getAffairsSelectRelationSearch({
      projectId: projectInfo.id,
      id: props.detail.id,
      searchValue: value,
    })
    setSelectList(
      response.map((i: Model.Affairs.AffairsInfo) => ({
        label: i.name,
        value: i.id,
      })),
    )
  }

  // 获取最近关联事务下拉列表
  const getSelectRelationRecent = async () => {
    const response = await getAffairsSelectRelationRecent({
      projectId: projectInfo.id,
      id: props.detail.id,
    })
    setRecentList(
      response.map((i: Model.Affairs.AffairsInfo) => ({
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
    getSelectRelationSearch(value)
  }

  // 关闭链接事务弹窗
  const onClose = () => {
    setSearchValue('')
    setIsVisible(false)
    setSelectList([])
    setRecentList([])
    form.resetFields()
  }

  // 提交链接事务表单
  const onConfirm = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    await addAffairsRelation({
      ...values,
      projectId: projectInfo.id,
      id: props.detail.id,
    })
    getMessage({ type: 'success', msg: '添加成功' })
    getRelationStoriesList(pageParams)
    onClose()
  }

  // 点击切换页码
  const onChangePage = (page: number, size: number) => {
    setPageParams({ page, pagesize: size })
    getRelationStoriesList({ page, pagesize: size })
  }

  // 改变顺序
  const onChangeData = async (
    item: any,
    data: { list: Model.Affairs.AffairsInfo[] },
  ) => {
    setResultData(
      resultData.map((i: any) => ({
        ...i,
        list: item.value === i.value ? data.list : i.list,
      })),
    )
    await affairsRelationDragSort({
      projectId: projectInfo.id,
      id: props.detail.id,
      relationIds: data.list.map((i: Model.Affairs.AffairsInfo) => i.id),
      type: item.value,
    })
  }

  useEffect(() => {
    if (projectInfo.id && props.detail.id) {
      // 获取链接事务列表
      getRelationStoriesList(pageParams)
    }
  }, [props.detail, projectInfo])

  return (
    <InfoItem id="sprint-linkSprint" className="info_item_tab">
      <DeleteConfirmModal />
      <CommonModal
        isVisible={isVisible}
        title="链接事务"
        onClose={onClose}
        confirmText="链接"
        onConfirm={onConfirm}
      >
        <FormWrap layout="vertical" form={form}>
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
            label="事务"
            name="relationId"
            rules={[{ required: true, message: '' }]}
          >
            <CustomSelect
              placeholder="请选择事务"
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
      <Label>链接事务</Label>
      <InfoItemWrap>
        <CommonButton type="primaryText" icon="plus" onClick={onClickOpen}>
          创建链接的事务
        </CommonButton>
        {resultData.map((i: any) => (
          <>
            {i.list.length > 0 && (
              <div key={i.value}>
                <SubLabel>{i.label}</SubLabel>
                <DragTable
                  columns={columns}
                  dataSource={{ list: i.list }}
                  onChangeData={arr => onChangeData(i, arr)}
                  showHeader={false}
                  hasOperation={operationList}
                />
              </div>
            )}
          </>
        ))}
        {allDataSource.list?.length <= 0 && <NoData />}
        {allDataSource.list?.length > 20 && (
          <PaginationBox
            total={allDataSource?.total}
            currentPage={allDataSource?.currentPage}
            pageSize={allDataSource?.pageSize}
            onChange={onChangePage}
          />
        )}
      </InfoItemWrap>
    </InfoItem>
  )
}

export default LinkSprint
