// 需求主页

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable no-undefined */
/* eslint-disable max-params */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react'
import Operation from './components/Operation'
import DemandTable from './components/DemandTable'
import DemandGrid from './components/DemandGrid'
import DemandTree from './components/DemandTree'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import styled from '@emotion/styled'
import WrapLeft from './components/WrapLeft'

const Right = styled.div<{ isShowLeft: boolean }>({
  width: '100%',
  height: 'calc(100vh - 64px)',
  overflowY: 'auto',
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
  const [isGrid, setIsGrid] = useState(0)
  const [searchItems, setSearchItems] = useState({})
  const [isVisible, setIsVisible] = useState(false)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [deleteId, setDeleteId] = useState(0)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { getDemandList, deleteDemand, setFilterParams, filterParams } =
    useModel('demand')
  const { isRefresh, setIsRefresh } = useModel('user')
  const [isSettingState, setIsSettingState] = useState(false)
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  // 用于当前操作层级不折叠
  const [topParentId, setTopParentId] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isShowLeft, setIsShowLeft] = useState(false)
  const { setFilterKeys, filterKeys } = useModel('project')

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
        class_id: key,
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
        class_id: key,
      }
    }
    if (state === 2) {
      params.tree = 1
      params.topParentId = topId ?? topParentId
    }
    setFilterParams(params)
    const result = await getDemandList(params)
    setDataList(result)
    setIsSpinning(false)
    props.onIsUpdate?.()
    setIsRefresh(false)
    setTopParentId(0)
  }

  useEffect(() => {
    // 进入需求主页清除已存储的筛选计数
    setFilterKeys([])
  }, [])

  useEffect(() => {
    getList(isGrid, searchItems, pageObj, order)
  }, [key, isGrid, order, pageObj])

  useEffect(() => {
    if (isRefresh) {
      getList(isGrid, searchItems, { page: 1, size: pageObj.size }, order)
    }
  }, [isRefresh])

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
      message.success(t('common.deleteSuccess'))
      setIsVisible(false)
      setDeleteId(0)
      getList(isGrid, searchItems, pageObj, order)
      myTreeComponent?.current?.init()
    } catch (error) {
      //
    }
  }

  const onSearch = (params: any) => {
    setSearchItems(params)
    setPageObj({
      page: 1,
      size: pageObj.size,
    })
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

  const onUpdate = (state?: boolean, topId?: any) => {
    getList(isGrid, searchItems, pageObj, order, state, topId)
    // myTreeComponent?.current?.init()
  }

  const keyValue = {
    key,
    changeKey: (value: any) => {
      setPageObj({ page: 1, size: pageObj.size })
      setKey(value)
      // 添加搜索项 计数
      const keys = value
        ? [...filterKeys, ...['classId']]
        : filterKeys?.filter((i: any) => i !== 'classId')

      setFilterKeys([...new Set(keys)])
    },
  }

  return (
    <TreeContext.Provider value={keyValue}>
      <div style={{ height: '100%', display: 'flex' }}>
        <DeleteConfirm
          text={t('common.confirmDelDemand')}
          isVisible={isVisible}
          onChangeVisible={() => setIsVisible(!isVisible)}
          onConfirm={onDeleteConfirm}
        />
        {isShowLeft && (
          <WrapLeft
            ref={myTreeComponent}
            projectId={projectId}
            isShowLeft={isShowLeft}
            onUpdate={onUpdate}
          />
        )}
        <Right isShowLeft={isShowLeft}>
          <Operation
            pid={projectId}
            isGrid={isGrid}
            onChangeGrid={val => onChangeGrid(val)}
            onChangeIsShowLeft={() => setIsShowLeft(!isShowLeft)}
            onChangeVisible={(e: any) => props.onChangeVisible(e)}
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
              filterParams={filterParams}
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
          {isGrid === 1 && (
            <DemandGrid
              onChangeVisible={onChangeOperation}
              onDelete={onDelete}
              data={dataList}
              isSpinning={isSpinning}
              onUpdate={onUpdate}
            />
          )}
        </Right>
      </div>
    </TreeContext.Provider>
  )
}

export default DemandMain
