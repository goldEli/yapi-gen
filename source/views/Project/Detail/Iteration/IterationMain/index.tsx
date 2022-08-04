/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable multiline-ternary */
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
import EditDemand from '../../Demand/components/EditDemand'

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
  const [isGrid, setIsGrid] = useState(true)
  const [isDemandVisible, setIsDemandVisible] = useState(false)
  const [isUpdateList, setIsUpdateList] = useState(false)
  const [demandItem, setDemandItem] = useState<any>({})
  const [isShowLeft, setIsShowLeft] = useState(true)
  const [dataList, setDataList] = useState<any>([])
  const [searchParams] = useSearchParams()
  const [isVisible, setIsVisible] = useState(false)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 10 })
  const projectId = searchParams.get('id')
  const iterateId = searchParams.get('iterateId')
  const { getDemandList, deleteDemand, getDemandInfo } = useModel('demand')
  const { setIsRefreshList } = useModel('iterate')
  const [deleteId, setDeleteId] = useState(0)
  const [currentDetail, setCurrentDetail] = useState<any>({})
  const [isSettingState, setIsSettingState] = useState(false)
  const [order, setOrder] = useState<any>({ value: 'asc', key: 'id' })
  const [searchItems, setSearchItems] = useState({})
  const getList = async (state: boolean, item: any, searchParamsObj: any) => {
    let params = {}
    if (state) {
      params = {
        projectId,
        all: true,
        panel: true,
        iterateIds: [currentDetail.id],
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
      }
    } else {
      params = {
        projectId,
        page: item ? item?.page : 1,
        pageSize: item ? item?.size : 10,
        order: order.value,
        orderKey: order.key,
        iterateIds: [currentDetail.id],
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
      }
    }
    const result = await getDemandList(params)
    setDataList(result)
  }

  useEffect(() => {
    setIsUpdateList(props.updateState)
  }, [props.updateState])

  useEffect(() => {
    if (currentDetail?.id) {
      getList(isGrid, pageObj, searchItems)
    }
  }, [currentDetail])

  const onChangeGrid = (val: boolean) => {
    setIsGrid(val)
    setDataList([])
    getList(val, pageObj, searchItems)
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
      message.success('删除成功')
      setIsVisible(false)
      setDeleteId(0)
      getList(isGrid, pageObj, searchItems)
      setIsRefreshList(true)
    } catch (error) {

      //
    }
  }

  const onChangePageNavigation = (item: any) => {
    setPageObj(item)
    getList(isGrid, item, searchItems)
  }

  const onChangeRow = () => {
    getList(isGrid, pageObj, searchItems)
    setIsRefreshList(true)
  }

  const onChangeVisible = () => {
    setIsDemandVisible(!isDemandVisible)
    setDemandItem({})
  }

  const onChangeOrder = (item: any) => {
    setOrder(item)
    getList(isGrid, pageObj, searchItems)
  }

  const onChangeIsUpdate = (val: boolean) => {
    setIsUpdateList(val)
    props.onChangeIsUpdate(false)
  }

  const onSearch = (params: string) => {
    setSearchItems(params)
    getList(isGrid, pageObj, params)
  }

  return (
    <div style={{ display: 'flex' }}>
      <EditDemand
        visible={isDemandVisible}
        onChangeVisible={onChangeVisible}
        id={demandItem?.id}
        onUpdate={onChangeRow}
        isIterateId={iterateId}
      />
      <DeleteConfirm
        text="确认要删除当前需求？"
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
        onConfirm={onDeleteConfirm}
      />
      <WrapLeft
        isShowLeft={isShowLeft}
        onChangeVisible={props.onChangeVisible}
        onCurrentDetail={setCurrentDetail}
        isUpdateList={isUpdateList}
        onIsUpdateList={onChangeIsUpdate}
        onChangeOperation={props.onChangeOperation}
        currentDetail={currentDetail}
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
        />
        {isGrid ? (
          <IterationGrid
            onChangeVisible={onChangeOperation}
            onDelete={onDelete}
            list={dataList}
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
          />
        )}
      </Right>
    </div>
  )
}

export default IterationMain
