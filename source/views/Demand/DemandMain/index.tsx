// 需求主页

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable no-undefined */
/* eslint-disable max-params */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react'
import Operation from './components/Operation'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import styled from '@emotion/styled'
import WrapLeft from './components/WrapLeft'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import { setFilterKeys } from '@store/project'
import { setFilterParams, setIsUpdateDemand } from '@store/demand'
import { deleteDemand, getDemandList } from '@/services/demand'
import ManageView from '@/components/ManageView'
import CreateViewPort from '@/components/CreateViewPort'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import { Content, DemandContent } from './style'
import { getMessage } from '@/components/Message'
import DemandTree from './components/DemandTree'
import DemandTable from './components/DemandTable'

const Right = styled.div<{ isShowLeft: boolean }>({
  width: '100%',
  height: '100%',
  paddingLeft: '24px',
})

interface Props {
  onChangeVisible(e: any): void
  onSetOperationItem(item: any): void
  isUpdate?: boolean
  onIsUpdate?(): void
}

export const TreeContext: any = React.createContext('')

const DemandMain = (props: Props) => {
  const myTreeComponent: any = useRef(null)
  const [t] = useTranslation()
  const [key, setKey] = useState()
  const keyRef = useRef()
  const [isGrid, setIsGrid] = useState(0)
  const [searchItems, setSearchItems] = useState<any>({})
  const [isVisible, setIsVisible] = useState(false)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [deleteId, setDeleteId] = useState(0)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { isRefresh } = useSelector(store => store.user)
  const [isSettingState, setIsSettingState] = useState(false)
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  // 用于当前操作层级不折叠
  const [topParentId, setTopParentId] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isShowLeft, setIsShowLeft] = useState(false)
  // 用于控制失焦事件与展开子需求冲突
  const [isUpdated, setIsUpdated] = useState(false)
  const { filterKeys } = useSelector(store => store.project)
  const { isUpdateDemand } = useSelector(store => store.demand)
  const [searchVal, setSearchVal] = useState('')
  const searchChoose = useSelector(store => store.view.searchChoose)
  const dispatch = useDispatch()

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
    props.onIsUpdate?.()
    dispatch(setIsRefresh(false))
    setTopParentId(0)
    setIsUpdated(false)
    dispatch(setIsUpdateDemand(false))
  }

  useEffect(() => {
    // 进入需求主页清除已存储的筛选计数
    setFilterKeys([])
  }, [])

  useEffect(() => {
    getList(isGrid, searchItems, pageObj, order)
  }, [key, isGrid, order, pageObj, projectId])

  useEffect(() => {
    if (isUpdateDemand) {
      getList(isGrid, searchItems, pageObj, order, false, topParentId)
    }
  }, [isUpdateDemand])

  useEffect(() => {
    if (props.isUpdate) {
      getList(isGrid, searchItems, pageObj, order)
    }
    myTreeComponent?.current?.init()
  }, [props.isUpdate])

  const onChangeGrid = (val: any) => {
    if (val !== isGrid) {
      setIsGrid(val)
      setDataList({ list: undefined })
    }
  }

  // 点击操作左侧三点
  const onChangeOperation = (e: any, item?: any) => {
    props.onSetOperationItem(item)
    props.onChangeVisible(e)
    setTopParentId(item?.topId)
  }

  const onDelete = (item: any) => {
    setDeleteId(item.id)
    setIsVisible(true)
    setTopParentId(item?.topId)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteDemand({ projectId, id: deleteId })
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
      setIsVisible(false)
      setDeleteId(0)
      getList(isGrid, searchItems, pageObj, order)
      myTreeComponent?.current?.init()
    } catch (error) {
      //
    }
  }

  const onSearch = (params: any) => {
    setDataList({ list: undefined })
    setIsUpdated(true)
    setSearchItems(params)
    setPageObj({
      page: 1,
      size: pageObj.size,
    })
  }

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

  const onChangePageNavigation = (item: any) => {
    setPageObj(item)
  }

  const onChangeRow = (topId?: any) => {
    getList(isGrid, searchItems, pageObj, order, false, topId)
  }

  const onChangeOrder = (item: any) => {
    setOrder(item)
  }

  // 更新需求列表，state： 是否有加载动画，topId: 用于树形结构展开，isClass： 是否编辑的是需求分类
  const onUpdate = (state?: boolean, topId?: any, isClass?: any) => {
    getList(isGrid, searchItems, pageObj, order, state, topId)
    // 是编辑需求分类的话，就更新左侧需求分类列表
    if (isClass) {
      myTreeComponent?.current?.init()
    }
  }

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
  // useEffect(() => {
  //   if (tapInputKey) {
  //     onInputSearch(tapInputKey)
  //   }
  //   return () => {
  //     dispatch(onTapInputKey(''))
  //   }
  // }, [tapInputKey])

  useEffect(() => {
    if (isRefresh) {
      getList(
        isGrid,
        searchItems,
        { page: 1, size: pageObj.size },
        order,
        false,
        topParentId,
      )
    }
  }, [isRefresh])

  const refresh = () => {
    getList(isGrid, searchItems, pageObj, order, false, topParentId)
  }
  return (
    <TreeContext.Provider value={keyValue}>
      <DeleteConfirm
        text={t('common.confirmDelDemand')}
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
        onConfirm={onDeleteConfirm}
      />
      <CreateViewPort pid={projectId} />
      <ManageView projectId={projectId} />
      <Content>
        <ProjectCommonOperation onInputSearch={onInputSearch} />
        <DemandContent>
          <WrapLeft
            ref={myTreeComponent}
            projectId={projectId}
            isShowLeft={isShowLeft}
            onUpdate={onUpdate}
            iKey={key}
          />
          <Right isShowLeft={isShowLeft}>
            <Operation
              pid={projectId}
              isGrid={isGrid}
              onChangeGrid={val => onChangeGrid(val)}
              onChangeIsShowLeft={() => setIsShowLeft(!isShowLeft)}
              onChangeVisible={(e: any) => props.onChangeVisible(e)}
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
            {isGrid === 2 && (
              <DemandTree
                onDelete={onDelete}
                data={dataList}
                onChangePageNavigation={onChangePageNavigation}
                onChangeRow={onChangeRow}
                settingState={isSettingState}
                onChangeSetting={setIsSettingState}
                onChangeOrder={onChangeOrder}
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
              />
            )}
          </Right>
        </DemandContent>
      </Content>
    </TreeContext.Provider>
  )
}

export default DemandMain
