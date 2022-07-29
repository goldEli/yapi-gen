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
  const [searchVal, setSearchVal] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 10 })
  const [deleteId, setDeleteId] = useState(0)
  const [dataList, setDataList] = useState<any>([])
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const { getDemandList, deleteDemand } = useModel('demand')
  const [settingState, setSettingState] = useState(false)
  const [order, setOrder] = useState<any>({ value: '', key: '' })

  const getList = async (
    state: boolean,
    val: string,
    item?: any,
    orderItem?: any,
  ) => {
    let params = {}
    if (state) {
      params = {
        projectId,
        all: true,
        panel: true,
        searchValue: val,
      }
    } else {
      params = {
        projectId,
        page: item.page,
        pageSize: item.size,
        order: orderItem.value,
        orderKey: orderItem.key,
        searchValue: val,
      }
    }
    const result = await getDemandList(params)
    setDataList(result)
    props.onIsUpdate?.()
  }

  useEffect(() => {
    getList(isGrid, searchVal, pageObj, order)
  }, [])

  useEffect(() => {
    if (props.isUpdate) {
      getList(isGrid, searchVal, pageObj, order)
    }
  }, [props.isUpdate])

  const onChangeGrid = (val: boolean) => {
    setIsGrid(val)
    setDataList([])
    getList(val, searchVal, pageObj, order)
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
      getList(isGrid, searchVal, pageObj, order)
    } catch (error) {

      //
    }
  }

  const onSearch = (val: string) => {
    setSearchVal(val)
    getList(isGrid, val, pageObj, order)
  }

  const onChangePageNavigation = (item: any) => {
    setPageObj(item)
    getList(isGrid, searchVal, item, order)
  }

  const onChangeRow = () => {
    getList(isGrid, searchVal, pageObj, order)
  }

  const onChangeOrder = (item: any) => {
    setOrder(item)
    getList(isGrid, searchVal, pageObj, item)
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
        settingState={settingState}
        onChangeSetting={setSettingState}
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
          settingState={settingState}
          onChangeSetting={setSettingState}
          onChangeOrder={onChangeOrder}
        />
      )}
    </div>
  )
}

export default DemandMain
