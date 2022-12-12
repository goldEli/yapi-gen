// 迭代主页

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable no-undefined */
/* eslint-disable react-hooks/exhaustive-deps */
import Operation from './components/Operation'
import IterationTable from './components/IterationTable'
import IterationGrid from './components/IterationGrid'
import WrapLeft from './components/WrapLeft'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'
import DeleteConfirm from '@/components/DeleteConfirm'
import EditDemand from '@/components/EditDemandNew'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'

const Right = styled.div<{ isShowLeft: boolean }>({}, ({ isShowLeft }) => ({
  width: isShowLeft ? 'calc(100% - 300px)' : '100%',
  height: 'calc(100vh - 64px)',
  overflowY: 'auto',
}))

interface Props {
  onChangeVisible(): void
  onChangeOperation(item: any): void
  updateState: boolean
  onChangeIsUpdate(val: boolean): void
}

const IterationMain = (props: Props) => {
  const [t] = useTranslation()
  const [isGrid, setIsGrid] = useState(false)
  const [isDemandVisible, setIsDemandVisible] = useState(false)
  const [demandItem, setDemandItem] = useState<any>({})
  const [isShowLeft, setIsShowLeft] = useState(true)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [searchParams] = useSearchParams()
  const [isVisible, setIsVisible] = useState(false)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { iterateId } = paramsData
  const { getDemandList, deleteDemand, getDemandInfo } = useModel('demand')
  const { setIsRefreshList, setIsUpdateList, setFilterParams } =
    useModel('iterate')
  const { isRefresh, setIsRefresh } = useModel('user')
  const [deleteId, setDeleteId] = useState(0)
  const [currentDetail, setCurrentDetail] = useState<any>({})
  const [isSettingState, setIsSettingState] = useState(false)
  const [order, setOrder] = useState<any>({ value: 'asc', key: 'id' })
  const [searchItems, setSearchItems] = useState({})
  const [isSpinning, setIsSpinning] = useState(false)
  const getList = async (
    state: boolean,
    item: any,
    searchParamsObj: any,
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
        iterateIds: [currentDetail?.id],
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
      }
    } else {
      params = {
        projectId,
        page: item ? item?.page : 1,
        pageSize: item ? item?.size : 10,
        order: order.value,
        orderKey: order.key,
        iterateIds: [currentDetail?.id],
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
      }
    }
    setFilterParams(params)
    const result = await getDemandList(params)
    setDataList(result)
    setIsSpinning(false)
    setIsRefresh(false)
    setIsUpdateList(false)
    props.onChangeIsUpdate(false)
  }

  useEffect(() => {
    if (currentDetail?.id) {
      if (isRefresh || currentDetail?.id) {
        setDataList({ list: undefined })
        getList(isGrid, { page: 1, size: pageObj.size }, searchItems)
      }
    }
  }, [currentDetail, isRefresh])

  useEffect(() => {
    if (props.updateState && currentDetail?.id) {
      setDataList({ list: undefined })
      getList(isGrid, { page: 1, size: pageObj.size }, searchItems)
    }
  }, [props.updateState, currentDetail])

  const onChangeGrid = (val: boolean) => {
    setIsGrid(val)
    setDataList({ list: undefined })
    if (currentDetail?.id) {
      setDataList({ list: undefined })
      getList(val, { page: 1, size: pageObj.size }, searchItems)
    }
  }

  const onChangeOperation = (e: any, item: any) => {
    setDemandItem(item)
    setIsDemandVisible(true)
    getDemandInfo({ projectId, id: item.id })
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
      setDataList({ list: undefined })
      getList(isGrid, pageObj, searchItems)
      setIsRefreshList(true)
    } catch (error) {
      //
    }
  }

  const onChangePageNavigation = (item: any) => {
    setPageObj(item)
    setDataList({ list: undefined })
    getList(isGrid, item, searchItems)
  }

  const onChangeRow = () => {
    setDataList({ list: undefined })
    getList(isGrid, pageObj, searchItems)
    setIsRefreshList(true)
  }

  const onChangeVisible = () => {
    setIsDemandVisible(!isDemandVisible)
    setDemandItem({})
  }

  const onChangeOrder = (item: any) => {
    setOrder(item)
    setDataList({ list: undefined })
    getList(isGrid, { page: 1, size: pageObj.size }, searchItems)
  }

  const onChangeIsUpdate = () => {
    props.onChangeIsUpdate(false)
  }

  const onSearch = (params: string) => {
    setSearchItems(params)
    setDataList({ list: undefined })
    getList(isGrid, { page: 1, size: pageObj.size }, params)
  }

  const onUpdate = (updateState?: boolean) => {
    getList(isGrid, { page: 1, size: pageObj.size }, searchItems, updateState)
  }

  return (
    <div style={{ display: 'flex' }}>
      <EditDemand
        visible={isDemandVisible}
        onChangeVisible={onChangeVisible}
        demandId={demandItem?.id}
        onUpdate={onChangeRow}
        iterateId={iterateId}
      />

      <DeleteConfirm
        text={t('common.confirmDelDemand')}
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
        onConfirm={onDeleteConfirm}
      />
      <WrapLeft
        isShowLeft={isShowLeft}
        onChangeVisible={props.onChangeVisible}
        onCurrentDetail={setCurrentDetail}
        onIsUpdateList={onChangeIsUpdate}
        onChangeOperation={props.onChangeOperation}
        currentDetail={currentDetail}
        updateState={props.updateState}
      />
      <Right isShowLeft={isShowLeft}>
        <Operation
          isGrid={isGrid}
          onChangeGrid={val => onChangeGrid(val)}
          onChangeIsShowLeft={() => setIsShowLeft(!isShowLeft)}
          onIsUpdateList={setIsUpdateList}
          currentDetail={currentDetail}
          settingState={isSettingState}
          onChangeSetting={setIsSettingState}
          onSearch={onSearch}
          isShowLeft={isShowLeft}
        />
        {isGrid ? (
          <IterationGrid
            onChangeVisible={onChangeOperation}
            onDelete={onDelete}
            data={dataList}
            isSpinning={isSpinning}
            hasId={currentDetail}
            onUpdate={onUpdate}
          />
        ) : (
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
            hasId={currentDetail}
            onUpdate={onUpdate}
          />
        )}
      </Right>
    </div>
  )
}

export default IterationMain
