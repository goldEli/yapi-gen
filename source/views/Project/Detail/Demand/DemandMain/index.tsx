/* eslint-disable multiline-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import Operation from './components/Operation'
import DemandTable from './components/DemandTable'
import DemandGrid from './components/DemandGrid'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'
import { message } from 'antd'

interface Props {
  onChangeVisible(e: any): void
  onSetOperationItem(item: any): void
  isUpdate?: boolean
  onIsUpdate?(): void
}

const DemandMain = (props: Props) => {
  const [isGrid, setIsGrid] = useState(false)
  const [searchItems, setSearchItems] = useState({})
  const [isVisible, setIsVisible] = useState(false)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 10 })
  const [deleteId, setDeleteId] = useState(0)
  const [dataList, setDataList] = useState<any>([])
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const { getDemandList, deleteDemand } = useModel('demand')
  const [isSettingState, setIsSettingState] = useState(false)
  const [order, setOrder] = useState<any>({ value: '', key: '' })

  const getList = async (
    state: boolean,
    searchParamsObj: any,
    item?: any,
    orderItem?: any,
  ) => {
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
      }
    }
    const result = await getDemandList(params)
    setDataList(result)
    props.onIsUpdate?.()
  }

  useEffect(() => {
    getList(isGrid, searchItems, pageObj, order)
  }, [])

  useEffect(() => {
    if (props.isUpdate) {
      getList(isGrid, searchItems, pageObj, order)
    }
  }, [props.isUpdate])

  const onChangeGrid = (val: boolean) => {
    setIsGrid(val)
    setDataList([])
    getList(val, searchItems, pageObj, order)
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
      message.success('删除成功')
      setIsVisible(false)
      setDeleteId(0)
      getList(isGrid, searchItems, pageObj, order)
    } catch (error) {

      //
    }
  }

  const onSearch = (params: string) => {
    setSearchItems(params)
    getList(isGrid, params, pageObj, order)
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
    getList(isGrid, searchItems, pageObj, item)
  }

  return (
    <div>
      <DeleteConfirm
        text="确认要删除当前需求？"
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
        onConfirm={onDeleteConfirm}
      />
      <Operation
        isGrid={isGrid}
        onChangeGrid={val => onChangeGrid(val)}
        onChangeVisible={(e: any) => props.onChangeVisible(e)}
        onSearch={onSearch}
        settingState={isSettingState}
        onChangeSetting={setIsSettingState}
      />
      {isGrid ? (
        <DemandGrid
          onChangeVisible={onChangeOperation}
          onDelete={onDelete}
          list={dataList}
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
        />
      )}
    </div>
  )
}

export default DemandMain
