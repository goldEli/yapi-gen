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
  const [isGrid, setIsGrid] = useState(false)
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
  const { getDemandList, deleteDemand, setFilterParams } = useModel('demand')
  const { isRefresh, setIsRefresh } = useModel('user')
  const [isSettingState, setIsSettingState] = useState(false)
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [isSpinning, setIsSpinning] = useState(false)
  const [isShowLeft, setIsShowLeft] = useState(false)
  const { getCategoryList } = useModel('project')

  const getList = async (
    state: boolean,
    searchParamsObj: any,
    item?: any,
    orderItem?: any,
    isInit?: boolean,
    updateState?: boolean,
  ) => {
    if (!updateState) {
      setIsSpinning(true)
    }

    let params = {}
    if (state) {
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
    const result = await getDemandList(params)
    setDataList(result)
    setIsSpinning(false)
    props.onIsUpdate?.()
    setIsRefresh(false)
  }

  useEffect(() => {
    getCategoryList({ projectId, isSelect: true })
  }, [])

  useEffect(() => {
    getList(isGrid, searchItems, { page: 1, size: pageObj.size }, order, true)
  }, [key])

  useEffect(() => {
    if (isRefresh) {
      getList(isGrid, searchItems, { page: 1, size: pageObj.size }, order, true)
    }
  }, [isRefresh])

  useEffect(() => {
    if (props.isUpdate) {
      getList(isGrid, searchItems, pageObj, order)
    }
    myTreeComponent?.current?.init()
  }, [props.isUpdate])

  const onChangeGrid = (val: boolean) => {
    setIsGrid(val)
    setDataList({ list: undefined })
    getList(val, searchItems, { page: 1, size: pageObj.size }, order)
  }

  const onChangeOperation = (e: any, item: any) => {
    props.onSetOperationItem(item)
    props.onChangeVisible(e)
  }

  const onDelete = (item: any) => {
    setDeleteId(item.id)
    setIsVisible(true)
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

  const onSearch = (params: string) => {
    setSearchItems(params)
    setFilterParams(params)
    getList(isGrid, params, { page: 1, size: pageObj.size }, order)
  }

  const onChangePageNavigation = (item: any) => {
    setPageObj(item)
    getList(isGrid, searchItems, item, order)
  }

  const onChangeRow = () => {
    getList(isGrid, searchItems, pageObj, order)
  }

  const onChangeOrder = (item: any) => {
    setOrder(item)
    getList(isGrid, searchItems, { page: 1, size: pageObj.size }, item)
  }

  const onUpdate = (state?: boolean) => {
    getList(isGrid, searchItems, pageObj, order, true, state)
    myTreeComponent?.current?.init()
  }

  const keyValue = {
    key,
    changeKey: (value: any) => {
      setPageObj({ page: 1, size: pageObj.size })
      setKey(value)
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
        {isShowLeft ? (
          <WrapLeft
            ref={myTreeComponent}
            projectId={projectId}
            isShowLeft={isShowLeft}
          />
        ) : null}
        <Right isShowLeft={isShowLeft}>
          <Operation
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
          {isGrid ? (
            <DemandGrid
              onChangeVisible={onChangeOperation}
              onDelete={onDelete}
              data={dataList}
              isSpinning={isSpinning}
              onUpdate={onUpdate}
            />
          ) : (
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
      </div>
    </TreeContext.Provider>
  )
}

export default DemandMain
