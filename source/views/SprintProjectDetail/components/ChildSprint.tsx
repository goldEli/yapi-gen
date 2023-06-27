/* eslint-disable no-undefined */
/* eslint-disable react/jsx-no-leaked-render */
import CommonButton from '@/components/CommonButton'
import {
  CancelText,
  InfoItem,
  InfoItemWrap,
  Label,
  LabelWrap,
  ProgressWrap,
} from '../style'
import CommonIconFont from '@/components/CommonIconFont'
import { CloseWrap, PriorityWrapTable } from '@/components/StyleCommon'
import { useEffect, useState } from 'react'
import { Space, Tooltip } from 'antd'
import CustomSelect from '@/components/CustomSelect'
import StateTag from '@/components/StateTag'
import DragTable from '@/components/DragTable'
import {
  setAddQuickSprintModal,
  setIsChangeDetailAffairs,
} from '@store/project'
import { useDispatch, useSelector } from '@store/index'
import {
  addAffairsChild,
  affairsChildDragSort,
  deleteAffairs,
  getAffairsChildList,
  getAffairsSelectChildren,
  getAffairsSelectChildrenRecent,
  updateAffairsPriority,
} from '@/services/affairs'
import { getMessage } from '@/components/Message'
import MultipleAvatar from '@/components/MultipleAvatar'
import PaginationBox from '@/components/TablePagination'
import NoData from '@/components/NoData'
import RelationDropdownMenu from '@/components/TableDropdownMenu/RelationDropdownMenu'
import MoreDropdown from '@/components/MoreDropdown'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import Item from 'antd/lib/list/Item'
import ChangePriorityPopover from '@/components/ChangePriorityPopover'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'

interface SelectItem {
  label: string
  value: number
}

const ChildSprint = (props: { detail: Model.Affairs.AffairsInfo }) => {
  const [t] = useTranslation()
  const [isShowMore, setIsShowMore] = useState(false)
  const dispatch = useDispatch()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const [isSearch, setIsSearch] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { projectInfo, isChangeDetailAffairs } = useSelector(
    store => store.project,
  )
  const [pageParams, setPageParams] = useState({ page: 1, pagesize: 20 })
  // 下拉数据
  const [selectList, setSelectList] = useState<SelectItem[]>([])
  // 最近事务数据
  const [recentList, setRecentList] = useState<SelectItem[]>([])
  const [dataSource, setDataSource] = useState<any>({
    list: undefined,
  })

  // 获取子事务列表
  const getList = async (page: { page: number; pagesize: number }) => {
    const response = await getAffairsChildList({
      projectId: projectInfo.id,
      id: props.detail.id,
      ...page,
    })
    setDataSource({
      ...response,
      list: response.list.map((i: any) => ({ ...i, index: i.id })),
    })
    dispatch(setIsChangeDetailAffairs(false))
  }

  // 获取搜索下拉事务列表
  const getSelectList = async (value: string) => {
    const response = await getAffairsSelectChildren({
      projectId: projectInfo.id,
      id: props.detail.id,
      keywords: value,
    })
    setSelectList(
      response.map((i: Model.Affairs.AffairsInfo) => ({
        label: i.name,
        value: i.id,
      })),
    )
  }

  // 获取最近下拉事务列表
  const getSelectRecentList = async () => {
    const response = await getAffairsSelectChildrenRecent({
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

  //   取消搜索
  const onCancelSearch = () => {
    setSearchValue('')
    setIsSearch(false)
  }

  // 下拉搜索
  const onSearch = (value: string) => {
    setSearchValue(value)
    getSelectList(value)
  }

  // 点击下拉的事务 -- 添加
  const onChangeSelect = async (value: any) => {
    await addAffairsChild({
      projectId: projectInfo.id,
      id: props.detail.id,
      childId: value,
    })
    getMessage({ type: 'success', msg: '添加成功' })
    onCancelSearch()
    getList(pageParams)
  }

  // 删除子事务确认事件
  const onDeleteConfirm = async (item: any) => {
    await deleteAffairs({ projectId: projectInfo.id, id: item.id })
    getMessage({ type: 'success', msg: '删除成功' })
    getList(pageParams)
  }

  // 删除关联工作项
  const onDeleteChange = (item: any) => {
    setIsShowMore(false)
    open({
      title: '删除确认',
      text: `您将永久删除${item.story_prefix_key}及其子事务，删除后将不可恢复请谨慎操作!`,
      onConfirm() {
        onDeleteConfirm(item)
        return Promise.resolve()
      },
    })
  }

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
      render: (text: any, record: any) => {
        return (
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
        )
      },
    },
    {
      title: '',
      dataIndex: 'handlers',
      render: (text: any) => (
        <>
          {text?.length > 0 && (
            <MultipleAvatar max={3} list={text?.handlers ?? []} />
          )}
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

  const operationList = [
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
                />
              }
              onChangeVisible={setIsShowMore}
            />
          </div>
        )
      },
    },
  ]

  // 创建子事务
  const onCreateChild = () => {
    dispatch(setAddQuickSprintModal({ visible: true, params: props.detail }))
  }

  // 点击搜素获取下拉数据列表
  const onClickSearch = () => {
    setIsSearch(true)
    getSelectRecentList()
  }

  // 表格拖拽排序
  const onChangeData = async (data: { list: Model.Affairs.AffairsInfo[] }) => {
    setDataSource({
      ...dataSource,
      list: data.list,
    })
    await affairsChildDragSort({
      projectId: projectInfo.id,
      id: props.detail.id,
      childrenIds: data.list.map((i: Model.Affairs.AffairsInfo) => i.id),
    })
  }

  // 点击切换页码
  const onChangePage = (page: number, size: number) => {
    setPageParams({ page, pagesize: size })
  }

  useEffect(() => {
    if (projectInfo.id && props.detail.id) {
      // 获取子事务列表
      getList(pageParams)
    }
  }, [props.detail, projectInfo])

  useEffect(() => {
    if (isChangeDetailAffairs) {
      // 获取子事务列表
      getList(pageParams)
    }
  }, [isChangeDetailAffairs])

  return (
    <InfoItem id="sprint-childSprint" className="info_item_tab">
      <DeleteConfirmModal />
      <LabelWrap>
        <Label>子事务</Label>
        {!isSearch && (
          <CloseWrap width={24} height={24} onClick={onClickSearch}>
            <CommonIconFont type="search" />
          </CloseWrap>
        )}
        {isSearch && (
          <Space size={16}>
            <CustomSelect
              placeholder="搜索事务名称或编号"
              getPopupContainer={(node: any) => node}
              style={{ width: 184 }}
              onSearch={onSearch}
              options={searchValue ? selectList : recentList}
              showSearch
              showArrow
              optionFilterProp="label"
              onChange={onChangeSelect}
              allowClear
              autoFocus
            />
            <CancelText onClick={onCancelSearch}>取消</CancelText>
          </Space>
        )}
      </LabelWrap>

      <InfoItemWrap>
        <CommonButton type="primaryText" icon="plus" onClick={onCreateChild}>
          创建子事务
        </CommonButton>
        {dataSource.total > 0 && (
          <>
            <Tooltip
              title={`${
                props.detail.child_story_statistics?.finish_percent
              }%已完成,${
                (props.detail.child_story_statistics?.finish_percent || 0) +
                (props.detail.child_story_statistics?.processing_percent || 0)
              }%进行中,${
                props.detail.child_story_statistics?.start_percent
              }%未完成`}
            >
              <ProgressWrap
                percent={
                  props.detail.child_story_statistics?.finish_percent || 0
                }
                success={{
                  percent: props.detail.child_story_statistics?.finish_percent,
                  strokeColor: 'var(--primary-d1)',
                }}
                format={percent => `已完成${percent}%`}
                trailColor="rgba(102, 136, 255, 0.1)"
                strokeColor="rgba(102, 136, 255, 0.4)"
              />
            </Tooltip>
            <DragTable
              columns={columns}
              dataSource={dataSource}
              onChangeData={arr => onChangeData(arr)}
              showHeader={false}
              hasOperation={operationList}
            />
          </>
        )}
        {dataSource.total <= 0 && <NoData />}
        {dataSource.total > 20 && (
          <PaginationBox
            total={dataSource?.total}
            currentPage={dataSource?.currentPage}
            pageSize={dataSource?.pageSize}
            onChange={onChangePage}
          />
        )}
      </InfoItemWrap>
    </InfoItem>
  )
}

export default ChildSprint
