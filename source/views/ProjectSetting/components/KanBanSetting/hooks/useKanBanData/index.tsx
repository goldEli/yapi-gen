import React from 'react'
import { DragStart, DropResult } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from '@store/index'
import { COLUMN, STATUS, UNASSIGNED_STATUS } from '../../constant'
import {
  assignStatus,
  clearMovingStatus,
  modifyAssignedStatus,
  modifyUnassignedStatus,
  setMovingStatus,
  sortColumn,
  unassignStatus,
} from '@store/kanbanConfig'

const useKanBanData = () => {
  const { columnList } = useSelector(store => store.KanbanConfig)
  const dispatch = useDispatch()
  const { movingStatus } = useSelector(store => store.KanbanConfig)

  // refactor with immerjs
  const onDragEnd = (result: DropResult) => {
    dispatch(clearMovingStatus())
    if (!result.destination) return
    const { source, destination, type } = result

    // 列排序
    if (type === COLUMN) {
      dispatch(
        sortColumn({
          source,
          destination,
        }),
      )
      return
    }

    // 未分配状态排序
    if (
      source.droppableId === UNASSIGNED_STATUS &&
      destination.droppableId === UNASSIGNED_STATUS
    ) {
      dispatch(
        modifyUnassignedStatus({
          source,
          destination,
        }),
      )
      return
    }
    // 分配状态
    if (
      source.droppableId === UNASSIGNED_STATUS &&
      destination.droppableId !== UNASSIGNED_STATUS
    ) {
      dispatch(
        assignStatus({
          source,
          destination,
        }),
      )
      return
    }

    // 取消状态分配
    if (
      source.droppableId !== UNASSIGNED_STATUS &&
      destination.droppableId === UNASSIGNED_STATUS
    ) {
      dispatch(
        unassignStatus({
          source,
          destination,
        }),
      )
      return
    }
    dispatch(modifyAssignedStatus({ source, destination }))
    // setData(
    //   produce(draft => {
    //     // 获取拖动源数据
    //     const sourceData = draft
    //       .find(item => item.groupId === getId(source.droppableId).groupId)
    //       ?.data.find(item => item.id === getId(source.droppableId).id)
    //     // 源移除的卡片数据
    //     const [removed] = sourceData?.list?.splice(source.index, 1) ?? []
    //     // 移除的卡片数据插入目标中
    //     if (removed) {
    //       sourceData?.list?.splice(destination.index, 0, removed)
    //     }
    //   }),
    // )
  }

  const getStatusByStatusId = (id: string) => {
    for (const column of columnList) {
      for (const category of column?.categories) {
        for (const status of category?.status ?? []) {
          if (status.flow_status_id + '' === id) {
            return status
          }
        }
      }
    }
    return null
  }
  const checkIsDrop = (categoryId: number) => {
    return categoryId === movingStatus?.story_type_id
  }
  const onDragStart = (result: DragStart) => {
    const id = parseInt(result.draggableId, 10)
    if (result.type === STATUS) {
      if (result.source.droppableId === UNASSIGNED_STATUS) {
        dispatch(
          setMovingStatus({
            id,
            fromUnassignedPlane: true,
          }),
        )
      } else {
        dispatch(
          setMovingStatus({
            id,
            fromUnassignedPlane: false,
          }),
        )
      }
    }
    // if (result.type === STATUS)
  }

  return {
    onDragEnd,
    columnList,
    checkIsDrop,
    onDragStart,
  }
}

export default useKanBanData
