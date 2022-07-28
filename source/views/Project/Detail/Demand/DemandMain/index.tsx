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
  const [isGrid, setIsGrid] = useState(true)
  const [searchVal, setSearchVal] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 10 })
  const [deleteId, setDeleteId] = useState(0)
  const [dataList, setDataList] = useState<any>([])
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const { getDemandList, deleteDemand } = useModel('demand')

  const getList = async (state: boolean, val: string, item?: any) => {
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
        page: item ? item?.page : 1,
        pageSize: item ? item?.size : 10,
        order: 'asc',
        orderKey: 'id',
        searchValue: val,
      }
    }
    const result = await getDemandList(params)
    setDataList(result)
    props.onIsUpdate?.()
  }

  useEffect(() => {
    getList(isGrid, searchVal, pageObj)
  }, [])

  useEffect(() => {
    if (props.isUpdate) {
      getList(isGrid, searchVal, pageObj)
    }
  }, [props.isUpdate])

  const onChangeGrid = (val: boolean) => {
    setIsGrid(val)
    setDataList([])
    getList(val, searchVal, pageObj)
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
      getList(isGrid, searchVal, pageObj)
    } catch (error) {

      //
    }
  }

  const onSearch = (val: string) => {
    setSearchVal(val)
    getList(isGrid, val, pageObj)
  }

  const onChangePageNavigation = (item: any) => {
    setPageObj(item)
    getList(isGrid, searchVal, item)
  }

  const onChangeRow = () => {
    getList(isGrid, searchVal, pageObj)
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
        />
      )}
    </div>
  )
}

export default DemandMain
