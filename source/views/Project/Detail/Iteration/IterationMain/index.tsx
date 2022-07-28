/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable multiline-ternary */
import Operation from './components/Operation'
import IterationTable from './components/IterationTable'
import IterationGrid from './components/IterationGrid'
import WrapLeft from './components/WrapLeft'
import { Menu, message } from 'antd'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'
import DeleteConfirm from '@/components/DeleteConfirm'

const Right = styled.div<{ isShowLeft: boolean }>({}, ({ isShowLeft }) => ({
  width: isShowLeft ? 'calc(100% - 300px)' : '100%',
}))

interface Props {
  onChangeVisible(): void
  onChangeOperation(item: any): void
  operationDetail: any
}

const IterationMain = (props: Props) => {
  const [isGrid, setIsGrid] = useState(true)
  const [isShowLeft, setIsShowLeft] = useState(true)
  const [dataList, setDataList] = useState<any>([])
  const [searchParams] = useSearchParams()
  const [isVisible, setIsVisible] = useState(false)
  const projectId = searchParams.get('id')
  const { getDemandList, deleteDemand } = useModel('demand')
  const [deleteId, setDeleteId] = useState(0)

  const getList = async (state: boolean) => {
    let params = {}
    if (state) {
      params = {
        projectId,
        all: true,
        panel: true,
        iterateIds: [props.operationDetail.id],
      }
    } else {
      params = {
        projectId,
        page: 1,
        pageSize: 10,
        order: 'asc',
        orderKey: 'id',
        iterateIds: [props.operationDetail.id],
      }
    }
    const result = await getDemandList(params)
    setDataList(result)
  }

  useEffect(() => {
    getList(isGrid)
  }, [props.operationDetail])

  const onChangeGrid = (val: boolean) => {
    setIsGrid(val)
    setDataList([])
    getList(val)
  }

  const onChangeOperation = (e: any, item: any) => {

    // props.onSetOperationItem(item)
    // props.onChangeVisible(e)
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
      getList(isGrid)
    } catch (error) {

      //
    }
  }
  return (
    <div style={{ display: 'flex' }}>
      <DeleteConfirm
        text="确认要删除当前需求？"
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
        onConfirm={onDeleteConfirm}
      />
      <WrapLeft
        isShowLeft={isShowLeft}
        onChangeVisible={props.onChangeVisible}
        onChangeOperation={props.onChangeOperation}
      />
      <Right isShowLeft={isShowLeft}>
        <Operation
          isGrid={isGrid}
          onChangeGrid={val => onChangeGrid(val)}
          onChangeVisible={props.onChangeVisible}
          onChangeIsShowLeft={() => setIsShowLeft(!isShowLeft)}
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
          />
        )}
      </Right>
    </div>
  )
}

export default IterationMain
