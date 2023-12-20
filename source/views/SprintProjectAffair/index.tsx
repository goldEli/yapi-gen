/* eslint-disable no-undefined */
import PermissionWrap from '@/components/PermissionWrap'
import { useDispatch, useSelector } from '@store/index'
import React, { useEffect, useRef, useState, lazy } from 'react'
import {
  ContentLeft,
  ContentMain,
  ContentRight,
  ContentWrap,
  Wrap,
} from './style'
import { useSearchParams } from 'react-router-dom'
import {
  getIsPermission,
  getParamsData,
  getProjectIdByUrl,
  onComputedPermission,
} from '@/tools'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'

import { Checkbox, Popover, Space, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import SprintTable from './components/SprintTable'
import SprintTree from './components/SprintTree'
import DeleteConfirm from '@/components/DeleteConfirm'
import {
  setAddWorkItemModal,
  setFilterKeys,
  setFilterParams,
} from '@store/project'
import CreateViewPort from '@/components/CreateViewPort'
import ManageView from '@/components/ManageView'
import { deleteAffairs, getAffairsList } from '@/services/affairs'
import Operation from './components/Operation'
import {
  clearValue,
  onTapSearchChoose,
  saveTitles,
  saveValue,
} from '@store/view'
import { OptionalFeld } from '@/components/OptionalFeld'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { getMessage } from '@/components/Message'
import useKeyPress from '@/hooks/useKeyPress'
import WrapLeft from './components/WrapLeft'
import { userInfo } from 'os'
import CommonButton from '@/components/CommonButton'
import IconFont from '@/components/IconFont'
import CommonIconFont from '@/components/CommonIconFont'

interface IProps {}

export const MoreWrap = styled.div<{ type?: any }>(
  {
    display: 'flex',
    alignItems: 'center',
    height: 32,
    borderRadius: 6,
    padding: '0 16px',
    fontSize: 14,
    fontWeight: 400,
    cursor: 'pointer',
  },
  ({ type }) => ({
    background: type ? 'var(--primary-d1)' : 'var(--hover-d2)',
    color: type ? 'var(--neutral-white-d7)' : 'var(--primary-d2)',
    '&: hover': {
      background: type ? 'var(--primary-d1)' : 'var(--hover-d2)',
    },
    '&: active': {
      background: type ? 'var(--primary-d1)' : 'var(--hover-d2)',
    },
  }),
)
const MoreItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 32,
  color: 'var(--neutral-n2)',
  fontSize: 14,
  fontWeight: 400,
  cursor: 'pointer',
  padding: '0 16px',
  svg: {
    color: 'var(--neutral-n3)',
  },
  '&: hover': {
    color: 'var(--neutral-n1-d1)!important',
    background: 'var(--hover-d3)',
    svg: {
      color: 'var(--neutral-n1-d1)!important',
    },
  },
})
export const TreeContext: any = React.createContext('')

const SprintProjectAffair: React.FC<IProps> = props => {
  const { useKeys } = useKeyPress()
  useKeys('1', '/ProjectDetail/Sprint')
  useKeys('2', '/ProjectDetail/KanBan')
  useKeys('3', '/Report/Performance')
  const dispatch = useDispatch()
  const { currentMenu } = useSelector(store => store.user)
  const titles = useSelector(store => store.view.tapTitles)
  const [key, setKey] = useState<any>()
  const keyRef = useRef()
  const myTreeComponent: any = useRef(null)
  const [isShowLeft, setIsShowLeft] = useState(false)
  const [t, i18n] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [isSettingState, setIsSettingState] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [searchItems, setSearchItems] = useState<any>({})
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 30 })
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [isDeleteCheck, setIsDeleteCheck] = useState(false)
  // 用于控制失焦事件与展开子需求冲突
  const [isUpdated, setIsUpdated] = useState(false)
  // 用于当前操作层级不折叠
  const [topParentId, setTopParentId] = useState(0)
  const [isGrid, setIsGrid] = useState(0)
  const [deleteItem, setDeleteItem] = useState<any>({})
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [searchVal, setSearchVal] = useState('')
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const [titleList3, setTitleList3] = useState<any[]>([])
  const [allTitleList, setAllTitleList] = useState<any[]>([])
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [plainOptions3, setPlainOptions3] = useState<any>([])
  const [widthRight, setWidthRight] = useState(0)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const searchChoose = useSelector(store => store.view.searchChoose)
  const OperationRef = useRef<any>()
  const [isVisibleMore, setIsVisibleMore] = useState(false)
  console.log('searchChoose', searchChoose)
  const projectId = paramsData.id
  const { projectInfo, filterKeys, isUpdateAddWorkItem } = useSelector(
    store => store.project,
  )
  const { userInfo } = useSelector(store => store.user)
  const getList = async (
    state: any,
    searchParamsObj: any,
    item?: any,
    orderItem?: any,
    updateState?: boolean,
    topId?: any,
  ) => {
    if (!updateState) {
      setIsSpinning(true)
    }
    let params: any = {}
    if (state === 1) {
      params = {
        projectId,
        all: true,
        panel: true,
        searchValue: searchVal,
        statusIds: searchParamsObj.statusId,
        iterateIds: searchParamsObj.iterateId,
        priorityIds: searchParamsObj.priorityId,
        userId:
          searchChoose?.system_view === 3
            ? userInfo.id
            : searchParamsObj.userId,
        tagIds: searchParamsObj.tagId,
        startTime: searchParamsObj.createdAtId,
        expectedStart: searchParamsObj.expectedStartAtId,
        expectedEnd: searchParamsObj.expectedendat,
        updatedTime: searchParamsObj.updatedat,
        endTime: searchParamsObj.finishAt,
        usersNameId:
          searchChoose?.system_view === 2
            ? userInfo.id
            : searchParamsObj.usersnameId,
        copySendId: searchParamsObj.usersCopysendNameId,
        class_ids: searchParamsObj.class_ids,
        category_id: searchParamsObj.category_id,
        schedule_start: searchParamsObj.schedule_start,
        schedule_end: searchParamsObj.schedule_end,
        custom_field: searchParamsObj?.custom_field,
        class_id: keyRef.current,

        discovery_version: searchParamsObj?.discovery_version,
        severity: searchParamsObj?.severity,
        solution: searchParamsObj?.solution,
        system_view: searchChoose?.system_view,
      }
    } else {
      params = {
        projectId,
        page: item.page,
        pageSize: item.size,
        order: orderItem.value,
        orderKey: orderItem.key,
        searchValue: searchVal,
        statusIds: searchParamsObj.statusId,
        iterateIds: searchParamsObj.iterateId,
        priorityIds: searchParamsObj.priorityId,
        userId:
          searchChoose?.system_view === 3
            ? userInfo.id
            : searchParamsObj.userId,
        tagIds: searchParamsObj.tagId,
        startTime: searchParamsObj.createdAtId,
        expectedStart: searchParamsObj.expectedStartAtId,
        expectedEnd: searchParamsObj.expectedendat,
        updatedTime: searchParamsObj.updatedat,
        endTime: searchParamsObj.finishAt,
        usersNameId:
          searchChoose?.system_view === 2
            ? userInfo.id
            : searchParamsObj.usersnameId,
        copySendId: searchParamsObj.usersCopysendNameId,
        class_ids: searchParamsObj.class_ids,
        category_id: searchParamsObj.category_id,
        schedule_start: searchParamsObj.schedule_start,
        schedule_end: searchParamsObj.schedule_end,
        custom_field: searchParamsObj?.custom_field,
        class_id: keyRef.current,

        discovery_version: searchParamsObj?.discovery_version,
        severity: searchParamsObj?.severity,
        solution: searchParamsObj?.solution,
        system_view: searchChoose?.system_view,
      }
    }
    if (state === 2) {
      params.tree = 1
      params.topParentId = topId ?? topParentId
    }
    dispatch(setFilterParams(params))
    const result = await getAffairsList(params)
    setDataList(result)
    setIsSpinning(false)
    // props.onIsUpdate?.()
    // dispatch(setIsRefresh(false))
    setTopParentId(0)
    setIsUpdated(false)
  }

  // 筛选条件
  const onSearch = (params: any) => {
    setDataList({ list: undefined })
    setIsUpdated(true)
    setSearchItems(params)
    setPageObj({
      page: 1,
      size: pageObj.size,
    })
  }

  // 搜索框
  const onInputSearch = (keyValue: any) => {
    if (searchVal !== keyValue) {
      setSearchVal(keyValue)
      const params = searchItems
      params.searchValue = keyValue
      setSearchItems(params)
      setDataList({ list: undefined })
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

  // 更新需求列表，state： 是否有加载动画，topId: 用于树形结构展开，isClass： 是否编辑的是需求分类
  const onUpdate = (state?: boolean, topId?: any, isClass?: any) => {
    getList(isGrid, searchItems, pageObj, order, state, topId)
    // 是编辑需求分类的话，就更新左侧需求分类列表
    if (isClass) {
      myTreeComponent?.current?.init(true)
    }
  }

  const refresh = () => {
    getList(isGrid, searchItems, pageObj, order, false, topParentId)
  }

  const onChangeGrid = (val: any) => {
    if (val !== isGrid) {
      setIsGrid(val)
      setDataList({ list: undefined })
    }
  }

  const onDelete = (item: any) => {
    setDeleteItem(item)
    setIsVisible(true)
    setTopParentId(item?.topId)
    setIsDeleteCheck([4, 5].includes(item.work_type))
  }

  // 删除事务
  const onDeleteConfirm = async () => {
    await deleteAffairs({
      projectId,
      id: deleteItem.id,
      isDeleteChild: isDeleteCheck ? 1 : 2,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    setIsVisible(false)
    setDeleteItem({})
    getList(isGrid, searchItems, pageObj, order)
    myTreeComponent?.current?.init(true)
  }

  const onChangeRow = (topId?: any) => {
    getList(isGrid, searchItems, pageObj, order, false, topId)
  }

  const keyValueTree = {
    key,
    changeKey: (value: any) => {
      setKey(value)
      keyRef.current = value
    },
  }

  // 获取显示字段配置
  const getShowkey = () => {
    setPlainOptions(projectInfo?.plainOptions || [])
    setPlainOptions2(projectInfo?.plainOptions2 || [])
    setPlainOptions3(projectInfo?.plainOptions3 || [])
    setTitleList(projectInfo?.titleList || [])
    setTitleList2(projectInfo?.titleList2 || [])
    setTitleList3(projectInfo?.titleList3 || [])
    setAllTitleList([
      ...(projectInfo.titleList || []),
      ...(projectInfo.titleList2 || []),
      ...(projectInfo.titleList3 || []),
    ])
    dispatch(
      saveTitles([
        ...(projectInfo.titleList || []),
        ...(projectInfo.titleList2 || []),
        ...(projectInfo.titleList3 || []),
      ]),
    )
  }

  const getCheckList = (
    list: CheckboxValueType[],
    list2: CheckboxValueType[],
    list3: CheckboxValueType[],
    all: CheckboxValueType[],
  ) => {
    setTitleList(list)
    setTitleList2(list2)
    setTitleList3(list3)
    setAllTitleList(all)
    dispatch(saveTitles(all))
  }

  function getTitle(arr: any, arr1: any) {
    const arr2: any = []
    arr1.forEach((i: any) => {
      arr2.push(i.value)
    })

    const myArr: any = []
    arr.forEach((i: any) => {
      if (arr2.includes(i)) {
        myArr.push(i)
      }
    })

    return myArr
  }

  useEffect(() => {
    if (titles) {
      setTitleList(getTitle(titles, plainOptions))
      setTitleList2(getTitle(titles, plainOptions2))
      setTitleList3(getTitle(titles, plainOptions3))
      setAllTitleList(titles)
    }
  }, [titles])

  useEffect(() => {
    if (projectInfo?.id) {
      getShowkey()
    }
  }, [projectInfo])

  useEffect(() => {
    getList(isGrid, searchItems, pageObj, order)
  }, [key, isGrid, projectId, order, pageObj])

  useEffect(() => {
    if (isShowLeft) {
      setWidthRight(myTreeComponent.current.leftWidth)
    } else {
      setWidthRight(0)
    }
  }, [isShowLeft])
  useEffect(() => {
    if (isUpdateAddWorkItem) {
      getList(isGrid, searchItems, pageObj, order)
    }
  }, [isUpdateAddWorkItem])

  useEffect(() => {
    dispatch(clearValue())
    // 进入主页清除已存储的筛选计数
    dispatch(setFilterKeys([]))
    dispatch(onTapSearchChoose(''))
  }, [])
  const onImportClick = () => {
    OperationRef.current?.onImportClick()
  }

  const onExportClick = () => {
    OperationRef.current?.onExportClick()
  }
  const hasImport = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/import' : 'b/transaction/import',
  )

  const hasExport = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/export' : 'b/transaction/export',
  )
  const moreOperation = (
    <div
      style={{
        padding: '4px 0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {hasImport ? null : (
        <MoreItem onClick={onImportClick}>
          <CommonIconFont type="export" />
          <span style={{ marginLeft: 8, whiteSpace: 'nowrap' }}>
            {t('importTransaction')}
          </span>
        </MoreItem>
      )}
      {hasExport ? null : (
        <MoreItem onClick={onExportClick}>
          <CommonIconFont type="Import" />
          <span style={{ marginLeft: 8, whiteSpace: 'nowrap' }}>
            {t('exportTransaction')}
          </span>
        </MoreItem>
      )}
    </div>
  )
  // 判断是否详情回来，并且权限是不是有
  const isLength =
    projectInfo?.id && projectInfo?.projectPermissions?.length <= 0

  return (
    <PermissionWrap
      auth={'b/transaction/'}
      permission={
        isLength
          ? ['0']
          : projectInfo?.projectPermissions?.map((i: any) => i.identity)
      }
    >
      <CreateViewPort pid={projectId} />
      <ManageView projectId={projectId} />
      <OptionalFeld
        allTitleList={allTitleList}
        plainOptions={plainOptions}
        plainOptions2={plainOptions2}
        plainOptions3={plainOptions3}
        checkList={titleList}
        checkList2={titleList2}
        checkList3={titleList3}
        isVisible={isSettingState}
        onClose={() => setIsSettingState(false)}
        getCheckList={getCheckList}
      />
      <TreeContext.Provider value={keyValueTree}>
        <Wrap>
          <DeleteConfirm
            title={t('deleteConfirmation')}
            isVisible={isVisible}
            onChangeVisible={() => setIsVisible(!isVisible)}
            onConfirm={onDeleteConfirm}
          >
            <div style={{ marginBottom: 9 }}>
              {t(
                'youWillPermanentlyDeleteWhichCannotBeRecoveredAfterPleaseBe',
                { key: deleteItem.story_prefix_key },
              )}
            </div>
            {deleteItem.work_type !== 6 && (
              <Checkbox
                disabled={[4, 5].includes(deleteItem.work_type)}
                checked={isDeleteCheck}
                onChange={e => setIsDeleteCheck(e.target.checked)}
              >
                {t('deleteAllSubtransactionsUnderThisTransactionAtTheSameTime')}
              </Checkbox>
            )}
          </DeleteConfirm>
          <ProjectCommonOperation
            onInputSearch={onInputSearch}
            title={t('search_for_transaction_name_or_number')}
            showSearchInput={false}
          >
            {/* {hasExport && hasImport ? null : (
              <Popover
                content={moreOperation}
                placement="bottom"
                getPopupContainer={node => node}
                key={isVisibleMore.toString()}
                visible={isVisibleMore}
                onVisibleChange={visible => setIsVisibleMore(visible)}
              >
                <MoreWrap>
                  <span>{t('newlyAdd.moreOperation')}</span>
                  <IconFont
                    style={{ fontSize: 16, marginLeft: 8 }}
                    type={isVisibleMore ? 'up' : 'down'}
                  />
                </MoreWrap>
              </Popover>
            )} */}
            {getIsPermission(
              projectInfo?.projectPermissions,
              'b/transaction/save',
            ) ? null : (
              <CommonButton
                onClick={() =>
                  dispatch(
                    setAddWorkItemModal({
                      visible: true,
                      params: {
                        type: 7,
                        title: t('createTransaction'),
                        projectId: getProjectIdByUrl(),
                      },
                    }),
                  )
                }
                type="primary"
              >
                <Tooltip placement="top" title={`${t('create')} (C)`}>
                  {t('createTransaction')}
                </Tooltip>
              </CommonButton>
            )}
          </ProjectCommonOperation>
          <ContentWrap>
            <ContentLeft>
              <WrapLeft
                change={(num: any) => {
                  setWidthRight(num)
                }}
                ref={myTreeComponent}
                projectId={projectId}
                isShowLeft={isShowLeft}
                onUpdate={onUpdate}
                iKey={key}
              />
            </ContentLeft>
            <ContentRight style={{ width: `calc(100% - ${widthRight}px)` }}>
              <Operation
                pid={projectId}
                isGrid={isGrid}
                onChangeGrid={val => onChangeGrid(val)}
                onChangeIsShowLeft={() => setIsShowLeft(!isShowLeft)}
                onRefresh={refresh}
                onSearch={onSearch}
                onInputSearch={onInputSearch}
                settingState={isSettingState}
                onChangeSetting={setIsSettingState}
                isShowLeft={isShowLeft}
                otherParams={{
                  page: pageObj.page,
                  pageSize: pageObj.size,
                  orderKey: order.key,
                  order: order.value,
                  classId: key,
                  all: isGrid,
                  panel: isGrid,
                }}
                dataLength={dataList?.total}
                statistics={dataList?.statistics}
                ref={OperationRef}
              />
              <ContentMain>
                {!isGrid && (
                  <SprintTable
                    data={dataList}
                    onDelete={onDelete}
                    onChangePageNavigation={setPageObj}
                    onChangeRow={onChangeRow}
                    onChangeOrder={setOrder}
                    isSpinning={isSpinning}
                    onUpdate={onUpdate}
                    titleList={titleList}
                    titleList2={titleList2}
                    titleList3={titleList3}
                    allTitleList={allTitleList}
                  />
                )}
                {isGrid === 2 && (
                  <SprintTree
                    data={dataList}
                    onDelete={onDelete}
                    onChangePageNavigation={setPageObj}
                    onChangeRow={onChangeRow}
                    titleList={titleList}
                    titleList2={titleList2}
                    titleList3={titleList3}
                    allTitleList={allTitleList}
                    onChangeOrder={setOrder}
                    isSpinning={isSpinning}
                    onUpdate={onUpdate}
                    onUpdateTopId={setTopParentId}
                    filterParams={{
                      ...searchItems,
                      projectId,
                      page: 1,
                      pageSize: 100,
                      order: '',
                      orderKey: '',
                    }}
                    isUpdated={isUpdated}
                  />
                )}
              </ContentMain>
            </ContentRight>
          </ContentWrap>
        </Wrap>
      </TreeContext.Provider>
    </PermissionWrap>
  )
}
export default SprintProjectAffair
