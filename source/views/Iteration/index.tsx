/* eslint-disable no-undefined */
/* eslint-disable react/jsx-no-leaked-render */
import PermissionWrap from '@/components/PermissionWrap'
import { useDispatch, useSelector } from '@store/index'
import {
  Content,
  IconWrap,
  IconWrapInfo,
  IterationContent,
  IterationInfo,
  IterationMain,
  IterationMainOperation,
} from './style'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import IterationList from './components/IterationList'
import { useCallback, useEffect, useRef, useState } from 'react'
import OperationGroup from '@/components/OperationGroup'
import { useTranslation } from 'react-i18next'
import { Space, Tooltip } from 'antd'
import ScreenMinHover from '@/components/ScreenMinHover'
import IterationStatus from '@/components/IterationStatus'
import { getIsPermission, getProjectIdByUrl } from '@/tools'
import { DividerWrap } from '@/components/StyleCommon'
import {
  setFilterKeys,
  setFilterParams,
  setProjectInfoValues,
} from '@store/project'
import { deleteDemand, getDemandList } from '@/services/demand'
import { setIsRefresh } from '@store/user'
import { setIsRefreshList, setIsUpdateList } from '@store/iterate'
import TableFilter from '@/components/TableFilter'
import EditAchievements from '../IterationDetail/components/EditAchievements'
import { updateIterateStatus } from '@/services/iterate'
import { getMessage } from '@/components/Message'
import DemandTree from './components/DemandTree'
import IterationTable from './components/IterationTable'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { Editor } from '@xyfe/uikit'
import NoData from '@/components/NoData'
import CommonModal from '@/components/CommonModal'
import { getIterateInfo } from '@store/iterate/iterate.thunk'
import Complete from '@/components/IterationStatus/Complete'
import useKeyPress from '@/hooks/useKeyPress'

const Iteration = () => {
  const { useKeys } = useKeyPress()
  useKeys('5', '/ProjectManagement/Demand')
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { currentMenu } = useSelector(store => store.user)
  const { iterateInfo } = useSelector(store => store.iterate)
  const { projectInfo, isUpdateAddWorkItem, projectInfoValues, filterKeys } =
    useSelector(store => store.project)
  const [isShowLeft, setIsShowLeft] = useState(true)
  const [isShow, setIsShow] = useState(false)
  const [isShow2, setIsShow2] = useState(false)
  const [targetVisible, setTargetVisible] = useState(false)
  const [isAchievements, setIsAchievements] = useState(false)
  const [filterState, setFilterState] = useState(true)
  const [isSettingState, setIsSettingState] = useState(false)
  const [isGrid, setIsGrid] = useState(0)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [searchItems, setSearchItems] = useState<any>({})
  // 用于控制失焦事件与展开子需求冲突
  const [isUpdated, setIsUpdated] = useState(false)
  // 用于当前操作层级不折叠
  const [topParentId, setTopParentId] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [searchList, setSearchList] = useState<any[]>([])
  const [filterBasicsList, setFilterBasicsList] = useState<any[]>([])
  const [filterSpecialList, setFilterSpecialList] = useState<any[]>([])
  const [filterCustomList, setFilterCustomList] = useState<any[]>([])
  const [searchVal, setSearchVal] = useState('')
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [isCompleteVisible, setIsCompleteVisible] = useState(false)
  const [editCompleteId, setEditCompleteId] = useState(0)

  const hasChangeStatus = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/status',
  )
  const isCanCheck = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/achieve/info',
  )

  const getList = async (
    state: any,
    item: any,
    searchParamsObj: any,
    updateState?: boolean,
    topId?: any,
  ) => {
    if (!updateState) {
      setIsSpinning(true)
    }
    let params: any = {
      projectId: getProjectIdByUrl(),
      page: item ? item?.page : 1,
      pageSize: item ? item?.size : 10,
      order: order.value,
      orderKey: order.key,
      iterateIds: [iterateInfo?.id],
      statusIds: searchParamsObj.statusId,
      priorityIds: searchParamsObj.priorityId,
      userId: searchParamsObj.userId,
      tagIds: searchParamsObj.tagId,
      startTime: searchParamsObj.createdAtId,
      expectedStart: searchParamsObj.expectedStartAtId,
      expectedEnd: searchParamsObj.expectedendat,
      updatedTime: searchParamsObj.updatedat,
      endTime: searchParamsObj.finishAt,
      usersNameId: searchParamsObj.usersnameId,
      copySendId: searchParamsObj.usersCopysendNameId,
      class_ids: searchParamsObj.class_ids,
      category_id: searchParamsObj.category_id,
      schedule_start: searchParamsObj.schedule_start,
      schedule_end: searchParamsObj.schedule_end,
      custom_field: searchParamsObj?.custom_field,
      searchValue: searchParamsObj.searchVal,
    }
    if (state === 2) {
      params.tree = 1
      params.topParentId = topId ?? topParentId
      params.iterateIds = [iterateInfo?.id]
    }
    dispatch(setFilterParams(params))
    const result = await getDemandList(params)
    setDataList(result)
    setIsSpinning(false)
    dispatch(setIsRefresh(false))
    dispatch(setIsUpdateList(false))
    setTopParentId(0)
    setIsUpdated(false)
  }

  //   搜索
  const onInputSearch = (keyValue: string) => {
    if (searchVal !== keyValue) {
      setSearchVal(keyValue)
      const params = searchItems
      params.searchVal = keyValue
      setSearchItems(params)
      setDataList({ list: undefined })
      getList(isGrid, { page: 1, size: pageObj.size }, params)
      setIsUpdated(true)
      setPageObj({
        page: 1,
        size: pageObj.size,
      })
      // 添加搜索项 计数
      const keys = keyValue
        ? [...filterKeys, ...['searchVal']]
        : filterKeys?.filter((i: any) => i !== 'searchVal')
      dispatch(setFilterKeys([...new Set(keys)]))
    }
  }

  const onFilterSearch = (e: any, customField: any) => {
    const params = {
      statusId: e.status,
      priorityId: e.priority,
      iterateId: e.iterate_name,
      tagId: e.tag,
      userId: e.user_name,
      usersnameId: e.users_name,
      usersCopysendNameId: e.users_copysend_name,
      createdAtId: e.created_at,
      expectedStartAtId: e.expected_start_at,
      expectedendat: e.expected_end_at,
      updatedat: e.updated_at,
      finishAt: e.finish_at,
      class_ids: e.class,
      category_id: e.category,
      schedule_start: e.schedule?.start,
      schedule_end: e.schedule?.end,
      custom_field: customField,
      searchValue: searchVal,
    }
    const result = { ...params, ...{ searchVal: searchVal } }
    setSearchItems(result)
    setDataList({ list: undefined })
    getList(isGrid, { page: 1, size: pageObj.size }, result)
  }

  const onChangeGrid = (val: any) => {
    setIsGrid(val)
    setDataList({ list: undefined })
    if (iterateInfo?.id) {
      setDataList({ list: undefined })
      getList(val, { page: 1, size: pageObj.size }, searchItems)
    }
  }

  const onClickIcon = (value: any) => {
    if (value === 1) {
      setIsShow2(false)
    } else {
      setIsShow(false)
    }
    setIsShowLeft(!isShowLeft)
  }

  const refresh = () => {
    getList(isGrid, pageObj, searchItems, false, topParentId)
  }

  const onChangeStatus = async (val: number) => {
    if (val !== iterateInfo?.status) {
      await updateIterateStatus({
        projectId: getProjectIdByUrl(),
        id: iterateInfo?.id,
        status: val,
      })
      getMessage({ msg: t('common.editS') as string, type: 'success' })
      const beforeValues = JSON.parse(JSON.stringify(projectInfoValues))
      // 修改迭代状态更新到项目下拉数据中
      const newValues = beforeValues?.map((i: any) =>
        i.key === 'iterate_name'
          ? {
              ...i,
              children: i.children?.map((v: any) => ({
                ...v,
                status: v.id === iterateInfo?.id ? val : v.status,
              })),
            }
          : i,
      )
      dispatch(setProjectInfoValues(newValues))
      dispatch(
        getIterateInfo({ projectId: getProjectIdByUrl(), id: iterateInfo?.id }),
      )
      dispatch(setIsUpdateList(true))
    }
  }

  // 点击迭代已完成
  const onCompleteIteration = useCallback((id: number) => {
    setIsCompleteVisible(true)
    setEditCompleteId(id)
  }, [])

  const getSearchKey = async (key?: any, type?: number) => {
    const filterFelid = projectInfo?.filterFelid
    if (key && type === 0) {
      setSearchList(searchList.filter((item: any) => item.content !== key))
      return
    }
    if (key && type === 1) {
      const addList = filterFelid?.filter((item: any) => item.content === key)

      setSearchList([...searchList, ...addList])

      return
    }

    const arr = filterFelid?.filter((item: any) => item.isDefault === 1)

    setSearchList(arr)
    setFilterBasicsList(projectInfo?.filterBasicsList)
    setFilterSpecialList(projectInfo?.filterSpecialList)
    setFilterCustomList(projectInfo?.filterCustomList)
  }

  const onUpdate = (updateState?: boolean) => {
    getList(
      isGrid,
      { page: 1, size: pageObj.size },
      searchItems,
      updateState,
      topParentId,
    )
  }

  const onChangeOrder = (item: any) => {
    setOrder(item)
    setDataList({ list: undefined })
    getList(isGrid, { page: 1, size: pageObj.size }, searchItems)
  }

  const onChangePageNavigation = (item: any) => {
    setPageObj(item)
    setDataList({ list: undefined })
    getList(isGrid, item, searchItems)
  }

  const onChangeRow = () => {
    setDataList({ list: undefined })
    getList(isGrid, pageObj, searchItems)
    dispatch(setIsRefreshList(true))
  }

  const onChangeOperation = async (item: any) => {
    // const result = await getDemandInfo({ projectId, id: item.id })
    // dispatch(setDemandInfo(result))
    setTopParentId(item?.topId)
  }

  const onDeleteConfirm = async (item: any) => {
    await deleteDemand({ projectId: getProjectIdByUrl(), id: item.id })
    dispatch(setIsRefreshList(true))
    getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
    setDataList({ list: undefined })
    getList(isGrid, pageObj, searchItems)
  }

  const onDelete = (item: any) => {
    setTopParentId(item?.topId)
    open({
      title: '删除确认',
      text: '确认删除该迭代？',
      onConfirm() {
        onDeleteConfirm(item)
        return Promise.resolve()
      },
    })
  }

  useEffect(() => {
    if (isUpdateAddWorkItem) {
      getList(isGrid, pageObj, searchItems, false, topParentId)
    }
  }, [isUpdateAddWorkItem])

  useEffect(() => {
    if (iterateInfo.id) {
      setDataList({ list: undefined })
      getList(isGrid, pageObj, searchItems, false, topParentId)
    }
  }, [iterateInfo])

  useEffect(() => {
    if (projectInfo?.id) {
      getSearchKey()
    }
  }, [projectInfo])
  return (
    <PermissionWrap
      auth="/ProjectManagement/Project"
      permission={currentMenu?.children?.map((i: any) => i.url)}
    >
      <CommonModal
        width={784}
        isVisible={targetVisible}
        onClose={() => setTargetVisible(false)}
        title={t('project.iterateTarget')}
        isShowFooter
      >
        <div
          style={{
            overflow: 'auto',
            padding: '0 20px 16px 24px',
            height: '60vh',
          }}
        >
          {iterateInfo?.info ? (
            <Editor
              value={iterateInfo?.info || '--'}
              getSuggestions={() => []}
              readonly
            />
          ) : (
            <NoData />
          )}
        </div>
      </CommonModal>
      <DeleteConfirmModal />

      <Content>
        <EditAchievements
          isAchievements={isAchievements}
          onClose={() => setIsAchievements(false)}
          projectId={getProjectIdByUrl()}
          id={iterateInfo?.id}
          isInfo={false}
        />
        <ProjectCommonOperation onInputSearch={onInputSearch} />
        <IterationContent>
          <IterationList
            isShowLeft={isShowLeft}
            onUpdate={refresh}
            onCompleteIteration={onCompleteIteration}
          />
          <IterationMain>
            <IterationMainOperation>
              <IterationInfo>
                {isShowLeft ? (
                  <Tooltip
                    key={isShow.toString()}
                    visible={isShow}
                    onVisibleChange={isShow3 => setIsShow(isShow3)}
                    getTooltipContainer={node => node}
                    title={t('common.collapseMenu')}
                  >
                    <IconWrapInfo
                      onClick={() => onClickIcon(1)}
                      type="outdent"
                      color="black"
                    />
                  </Tooltip>
                ) : (
                  <Tooltip
                    key={isShow2.toString()}
                    visible={isShow2}
                    onVisibleChange={isShow1 => setIsShow2(isShow1)}
                    getTooltipContainer={node => node}
                    title={t('common.openMenu')}
                  >
                    <IconWrapInfo
                      onClick={() => onClickIcon(2)}
                      type="indent"
                      color="black"
                    />
                  </Tooltip>
                )}
                {iterateInfo?.id && (
                  <>
                    <Tooltip title={iterateInfo?.name}>
                      <span className="iterationName">{iterateInfo?.name}</span>
                    </Tooltip>
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--neutral-n4)',
                        marginRight: 8,
                      }}
                    >
                      {iterateInfo?.createdTime}-{iterateInfo?.endTime}
                    </span>
                    <IterationStatus
                      hasChangeStatus={hasChangeStatus}
                      iterateInfo={iterateInfo}
                      onChangeStatus={onChangeStatus}
                      onCompleteIteration={onCompleteIteration}
                    />
                    <Space size={8} style={{ marginLeft: 8 }}>
                      <ScreenMinHover
                        label={t('project.iterateTarget')}
                        icon="detail"
                        onClick={() => setTargetVisible(true)}
                        isActive={targetVisible}
                      />
                      {isCanCheck ? null : (
                        <>
                          <DividerWrap type="vertical" />
                          <ScreenMinHover
                            label={t('p2.d2')}
                            icon="iteration"
                            onClick={() => setIsAchievements(true)}
                            isActive={isAchievements}
                          />
                        </>
                      )}
                    </Space>
                  </>
                )}
              </IterationInfo>
              <OperationGroup
                onChangeFilter={() => setFilterState(!filterState)}
                onChangeGrid={onChangeGrid}
                onRefresh={refresh}
                isGrid={isGrid}
                filterState={filterState}
                settingState={isSettingState}
                onChangeSetting={() => setIsSettingState(!isSettingState)}
              />
            </IterationMainOperation>
            {filterState ? null : (
              <TableFilter
                onFilter={getSearchKey}
                onSearch={onFilterSearch}
                list={searchList}
                basicsList={filterBasicsList?.filter(
                  (i: any) => i.is_flaw !== 1,
                )}
                specialList={filterSpecialList}
                customList={filterCustomList}
                isIteration
              />
            )}
            {isGrid === 2 && (
              <DemandTree
                onChangeVisible={onChangeOperation}
                onDelete={onDelete}
                data={dataList}
                onChangePageNavigation={onChangePageNavigation}
                onChangeRow={onChangeRow}
                settingState={isSettingState}
                onChangeSetting={setIsSettingState}
                onChangeOrder={onChangeOrder}
                isSpinning={isSpinning}
                onUpdate={onUpdate}
                filterParams={{
                  ...searchItems,
                  projectId: getProjectIdByUrl(),
                  page: 1,
                  pageSize: 100,
                  order: '',
                  orderKey: '',
                  iterateIds: [iterateInfo.id],
                }}
                isUpdated={isUpdated}
                iterateId={iterateInfo?.id}
                onUpdateTopId={setTopParentId}
                hasId={iterateInfo}
              />
            )}
            {!isGrid && (
              <IterationTable
                onChangeVisible={onChangeOperation}
                onDelete={onDelete}
                data={dataList}
                onChangePageNavigation={onChangePageNavigation}
                onChangeRow={onChangeRow}
                settingState={isSettingState}
                onChangeSetting={setIsSettingState}
                onChangeOrder={onChangeOrder}
                isSpinning={isSpinning}
                hasId={iterateInfo}
                onUpdate={onUpdate}
                iterateId={iterateInfo?.id}
              />
            )}
          </IterationMain>
        </IterationContent>
        <Complete
          iterationId={editCompleteId}
          isVisible={isCompleteVisible}
          title="完成迭代"
          onClose={() => {
            setIsCompleteVisible(false)
          }}
          refreshLeftList={refresh}
        />
      </Content>
    </PermissionWrap>
  )
}

export default Iteration
