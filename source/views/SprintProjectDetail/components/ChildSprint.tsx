/* eslint-disable no-undefined */
/* eslint-disable react/jsx-no-leaked-render */
import CommonButton from '@/components/CommonButton'
import {
  AddText,
  CancelText,
  InfoItem,
  InfoItemWrap,
  Label,
  LabelWrap,
  ProgressWrap,
} from '../style'
import CommonIconFont from '@/components/CommonIconFont'
import { CloseWrap } from '@/components/StyleCommon'
import { useEffect, useState } from 'react'
import { Space, Tooltip } from 'antd'
import CustomSelect from '@/components/CustomSelect'
import StateTag from '@/components/StateTag'
import DragTable from '@/components/DragTable'
import { setAddQuickSprintModal } from '@store/project'
import { useDispatch, useSelector } from '@store/index'
import {
  addAffairsChild,
  affairsChildDragSort,
  getAffairsChildList,
  getAffairsSelectChildren,
  getAffairsSelectChildrenRecent,
} from '@/services/affairs'
import { getMessage } from '@/components/Message'
import MultipleAvatar from '@/components/MultipleAvatar'
import PaginationBox from '@/components/TablePagination'
import NoData from '@/components/NoData'

interface SelectItem {
  label: string
  value: number
}

const ChildSprint = () => {
  const dispatch = useDispatch()
  const [isSearch, setIsSearch] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { affairsInfo } = useSelector(store => store.affairs)
  const { projectInfo } = useSelector(store => store.project)
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
      id: affairsInfo.id,
      ...page,
    })
    setDataSource(response)
  }

  // 获取搜索下拉事务列表
  const getSelectList = async () => {
    const response = await getAffairsSelectChildren({
      projectId: projectInfo.id,
      id: affairsInfo.id,
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
      id: affairsInfo.id,
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

  // 点击下拉的事务 -- 添加
  const onChangeSelect = async (value: any) => {
    await addAffairsChild({
      projectId: projectInfo.id,
      id: affairsInfo.id,
      childId: value,
    })
    getMessage({ type: 'success', msg: '添加成功' })
    onCancelSearch()
    getList(pageParams)
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
      render: (text: any) => <CommonIconFont type={text.icon} />,
    },
    {
      title: '',
      dataIndex: 'handlers',
      render: (text: any) => <MultipleAvatar max={3} list={text?.handlers} />,
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

  // 创建子事务
  const onCreateChild = () => {
    dispatch(setAddQuickSprintModal({ visible: true }))
  }

  // 点击搜素获取下拉数据列表
  const onClickSearch = () => {
    setIsSearch(true)
    getSelectList()
    getSelectRecentList()
  }

  // 表格拖拽排序
  const onDragTable = async (data: { list: Model.Affairs.AffairsInfo[] }) => {
    setDataSource(data)
    await affairsChildDragSort({
      projectId: projectInfo.id,
      id: affairsInfo.id,
      childrenIds: data.list.map((i: Model.Affairs.AffairsInfo) => i.id),
    })
  }

  // 点击切换页码
  const onChangePage = (page: number, size: number) => {
    setPageParams({ page, pagesize: size })
  }

  useEffect(() => {
    if (projectInfo.id && affairsInfo.id) {
      // 获取子事务列表
      getList(pageParams)
    }
  }, [affairsInfo, projectInfo])

  return (
    <InfoItem id="sprint-childSprint" className="info_item_tab">
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
              onSearch={setSearchValue}
              options={searchValue ? selectList : recentList}
              showSearch
              showArrow
              optionFilterProp="label"
              onChange={onChangeSelect}
              mode="multiple"
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
        {dataSource.list && (
          <>
            <Tooltip
              title={`${
                affairsInfo.child_story_statistics?.finish_percent
              }%已完成,${
                (affairsInfo.child_story_statistics?.finish_percent || 0) +
                (affairsInfo.child_story_statistics?.processing_percent || 0)
              }%进行中,${
                affairsInfo.child_story_statistics?.start_percent
              }%未完成`}
            >
              <ProgressWrap
                percent={
                  (affairsInfo.child_story_statistics?.finish_percent || 0) +
                  (affairsInfo.child_story_statistics?.processing_percent || 0)
                }
                success={{
                  percent: affairsInfo.child_story_statistics?.finish_percent,
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
              onChangeData={onDragTable}
            />
          </>
        )}
        {!dataSource.list && <NoData />}
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
