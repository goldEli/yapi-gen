/* eslint-disable no-undefined */
import CreateViewPort from '@/components/CreateViewPort'
import ManageView from '@/components/ManageView'
import PermissionWrap from '@/components/PermissionWrap'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { useSearchParams } from 'react-router-dom'
import {
  ContentLeft,
  ContentMain,
  ContentRight,
  ContentWrap,
  Wrap,
} from './style'
import React, { useEffect, useRef, useState } from 'react'
import WrapLeft from './components/WrapLeft'
import { useTranslation } from 'react-i18next'
import {
  setFilterKeys,
  setFilterParams,
  setIsUpdateAddWorkItem,
} from '@store/project'
import Operation from './components/Operation'
import DemandTree from './components/DemandTree'
import DemandTable from './components/DemandTable'
import { deleteDemand, getDemandList } from '@/services/demand'
import { getMessage } from '@/components/Message'
import { setIsRefresh } from '@store/user'
import { OptionalFeld } from '@/components/OptionalFeld'
import { onTapTitles, saveTitles } from '@store/view'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import useKeyPress from '@/hooks/useKeyPress'
export const TreeContext: any = React.createContext('')

const DemandIndex = () => {
  const { useKeys } = useKeyPress()
  useKeys('1', '/ProjectManagement/Iteration')
  useKeys('2', '/ProjectManagement/KanBan')
  useKeys('3', '/Report/PerformanceInsight')
  const keyRef = useRef()
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const myTreeComponent: any = useRef(null)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const [key, setKey] = useState()
  const [isGrid, setIsGrid] = useState(0)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [searchVal, setSearchVal] = useState('')
  const [isShowLeft, setIsShowLeft] = useState(false)
  const [isSettingState, setIsSettingState] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [searchItems, setSearchItems] = useState<any>({})
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  // 用于控制失焦事件与展开子需求冲突
  const [isUpdated, setIsUpdated] = useState(false)
  // 用于当前操作层级不折叠
  const [topParentId, setTopParentId] = useState(0)
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const [titleList3, setTitleList3] = useState<any[]>([])
  const [allTitleList, setAllTitleList] = useState<any[]>([])
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [plainOptions3, setPlainOptions3] = useState<any>([])
  const { filterKeys, isUpdateAddWorkItem, projectInfo } = useSelector(
    store => store.project,
  )
  const { currentMenu } = useSelector(store => store.user)
  const searchChoose = useSelector(store => store.view.searchChoose)
  const titles = useSelector(store => store.view.tapTitles)
  const tapSort = useSelector(store => store.view.tapSort)

  const keyValue = {
    key,
    changeKey: (value: any) => {
      setPageObj({ page: 1, size: pageObj.size })
      setKey(value)
      keyRef.current = value
      // 添加搜索项 计数
      const keys = value
        ? [...filterKeys, ...['classId']]
        : filterKeys?.filter((i: any) => i !== 'classId')

      dispatch(setFilterKeys([...new Set(keys)]))
    },
  }

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
        searchValue: searchParamsObj.searchValue,
        statusIds: searchParamsObj.statusId,
        iterateIds: searchParamsObj.iterateId,
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
        class_id: keyRef.current,
        system_view: searchChoose ? searchChoose['system_view'] : undefined,
      }
    } else {
      params = {
        projectId,
        page: item.page,
        pageSize: item.size,
        order: orderItem.value,
        orderKey: orderItem.key,
        searchValue: searchParamsObj.searchValue,
        statusIds: searchParamsObj.statusId,
        iterateIds: searchParamsObj.iterateId,
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
        class_id: keyRef.current,
        system_view: searchChoose ? searchChoose['system_view'] : undefined,
      }
    }
    if (state === 2) {
      params.tree = 1
      params.topParentId = topId ?? topParentId
    }
    dispatch(setFilterParams(params))
    const result = await getDemandList(params)
    setDataList(result)
    setIsSpinning(false)
    dispatch(setIsRefresh(false))
    setTopParentId(0)
    setIsUpdated(false)
    dispatch(setIsUpdateAddWorkItem(false))
  }

  //   全局搜索
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
      myTreeComponent?.current?.init()
    }
  }

  const refresh = () => {
    getList(isGrid, searchItems, pageObj, order, false, topParentId)
  }

  const onChangeRow = (topId?: any) => {
    getList(isGrid, searchItems, pageObj, order, false, topId)
  }

  //   删除确认事件
  const onDeleteConfirm = async (id: number) => {
    await deleteDemand({ projectId, id })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    getList(isGrid, searchItems, pageObj, order)
    myTreeComponent?.current?.init()
  }

  //   点击删除
  const onDelete = (item: any) => {
    setTopParentId(item?.topId)
    open({
      title: '删除确认',
      text: t('common.confirmDelDemand'),
      onConfirm() {
        onDeleteConfirm(item.id)
        return Promise.resolve()
      },
    })
  }

  //   搜索
  const onSearch = (params: any) => {
    setDataList({ list: undefined })
    setIsUpdated(true)
    setSearchItems(params)
    setPageObj({
      page: 1,
      size: pageObj.size,
    })
  }

  //   切换模式
  const onChangeGrid = (val: any) => {
    if (val !== isGrid) {
      setIsGrid(val)
      setDataList({ list: undefined })
    }
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

  const getTitle = (arr: any, arr1: any) => {
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
    if (projectInfo?.id) {
      getShowkey()
    }
  }, [projectInfo])

  useEffect(() => {
    if (titles) {
      setTitleList(getTitle(titles, plainOptions))
      setTitleList2(getTitle(titles, plainOptions2))
      setTitleList3(getTitle(titles, plainOptions3))

      setAllTitleList(titles)
    }
  }, [titles])

  // useEffect(() => {
  //   if (tapSort) {
  //     const key = Object.keys(tapSort)
  //     const value = Object.values(tapSort)

  //     if (tapSort) {
  //       setOrder({ value: value[0], key: key[0] })
  //     }
  //   }
  // }, [tapSort])

  useEffect(() => {
    getList(isGrid, searchItems, pageObj, order)
  }, [key, isGrid, order, pageObj, projectId])

  useEffect(() => {
    if (isUpdateAddWorkItem) {
      getList(isGrid, searchItems, pageObj, order)
    }
  }, [isUpdateAddWorkItem])

  useEffect(() => {
    // 进入主页清除已存储的筛选计数
    setFilterKeys([])
    return () => {
      dispatch(
        onTapTitles([
          'prefix_key',
          'name',
          'status',
          'priority',
          'child_story_count',
          'iterate_name',
          'category',
          'schedule',
          'users_name',
          'created_at',
          'expected_start_at',
          'expected_end_at',
        ]),
      )
    }
  }, [])

  return (
    <PermissionWrap
      auth="/ProjectManagement/Project"
      permission={currentMenu?.children?.map((i: any) => i.url)}
    >
      <DeleteConfirmModal />
      <CreateViewPort pid={projectId} />
      <ManageView projectId={projectId} />
      <OptionalFeld
        allTitleList={allTitleList}
        plainOptions={plainOptions.filter((i: any) => i.is_flaw !== 1)}
        plainOptions2={plainOptions2}
        plainOptions3={plainOptions3}
        checkList={titleList}
        checkList2={titleList2}
        checkList3={titleList3}
        isVisible={isSettingState}
        onClose={() => setIsSettingState(false)}
        getCheckList={getCheckList}
      />
      <TreeContext.Provider value={keyValue}>
        <Wrap>
          <ProjectCommonOperation onInputSearch={onInputSearch} />
          <ContentWrap>
            <ContentLeft>
              <WrapLeft
                ref={myTreeComponent}
                projectId={projectId}
                isShowLeft={isShowLeft}
                onUpdate={onUpdate}
                iKey={key}
              />
            </ContentLeft>
            <ContentRight>
              <Operation
                pid={projectId}
                isGrid={isGrid}
                onChangeGrid={val => onChangeGrid(val)}
                onChangeIsShowLeft={() => setIsShowLeft(!isShowLeft)}
                onRefresh={refresh}
                onSearch={onSearch}
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
              />
              <ContentMain>
                {isGrid === 2 && (
                  <DemandTree
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
                {!isGrid && (
                  <DemandTable
                    onDelete={onDelete}
                    data={dataList}
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
              </ContentMain>
            </ContentRight>
          </ContentWrap>
        </Wrap>
      </TreeContext.Provider>
    </PermissionWrap>
  )
}

export default DemandIndex
