import React from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { produce } from 'immer'
import { getId } from '../../utils'
import { useDispatch, useSelector } from '@store/index'
import { UNASSIGNED_STATUS } from '../../constant'
import {
  modifyAssignedStatus,
  modifyUnassignedStatus,
} from '@store/kanbanConfig'

const useKanBanData = () => {
  const { columnList } = useSelector(store => store.KanbanConfig)
  const dispatch = useDispatch()

  // refactor with immerjs
  const onDragEnd = (result: DropResult) => {
    console.log(result)
    if (!result.destination) return
    const { source, destination, draggableId } = result

    // 跨容器拖动
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

  return {
    onDragEnd,
    columnList,
  }
}

export default useKanBanData
