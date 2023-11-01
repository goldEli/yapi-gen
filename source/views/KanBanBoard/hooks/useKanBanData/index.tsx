import React from 'react'
import { DragStart, DropResult } from 'react-beautiful-dnd'
import { produce } from 'immer'
import { getId } from '../../utils'
import { useDispatch, useSelector } from '@store/index'
import { setMovingStory } from '@store/kanBan'
import useGroupType from '../useGroupType'
import { modifyPriority, sortStory } from '@store/kanBan/kanBan.thunk'

const useKanBanData = () => {
  const { kanbanInfoByGroup, kanbanConfig } = useSelector(store => store.kanBan)
  const dispatch = useDispatch()
  const { groupType } = useGroupType()

  // const getIds = (droppableId: string, draggableId: string) => {
  //   const { id: columnId, groupId } = getId(droppableId)
  //   const { id: storyId } = getId(draggableId)
  //   return {
  //     storyId,
  //     columnId,
  //     groupId,
  //   }
  // }

  const getIdsFromDraggableId = (draggableId: string) => {
    const [groupId, columnId, storyId] = draggableId
      .split('-')
      .map(item => parseInt(item, 10))
    return {
      storyId,
      columnId,
      groupId,
    }
  }

  const getStory = (draggableId: string) => {
    const { storyId, columnId, groupId } = getIdsFromDraggableId(draggableId)
    const group = kanbanInfoByGroup.find(group => group.id === groupId)
    const column = group?.columns.find(column => column.id === columnId)
    const story = column?.stories.find(story => story.id === storyId)

    return story
  }

  const onDragStart = (start: DragStart) => {
    const { columnId, groupId } = getIdsFromDraggableId(start.draggableId)
    const story = getStory(start.draggableId) ?? null
    if (!story) {
      throw Error('no data')
    }
    const { category_status_id } = story
    const status = kanbanConfig?.columns
      ?.find(column => column.id === columnId)
      ?.categories.find(category => category.id === story.category_id)
      ?.status?.find(item => item.flow_status_id === category_status_id)
    dispatch(
      setMovingStory({
        columnId,
        story,
        status,
        groupId,
      }),
    )
  }
  // refactor with immerjs
  const onDragEnd = (result: DropResult) => {
    dispatch(setMovingStory(null))
    if (!result.destination) return
    const { source, destination } = result

    // 同组同列拖拽排序
    if (source.droppableId === destination.droppableId) {
      const { storyId, groupId, columnId } = getIdsFromDraggableId(
        result.draggableId,
      )
      // draggableId
      //取消排序
      // dispatch(
      //   sortStory({
      //     groupId,
      //     columnId,
      //     storyId,
      //     startIndex: source.index,
      //     destinationIndex: destination.index,
      //   }),
      // )
    }

    if (groupType === 'priority') {
      // 修改优先级
      if (source.droppableId !== destination.droppableId) {
        const {
          storyId: sourceStoryId,
          groupId: sourceGroupId,
          columnId: sourceColumnId,
        } = getIdsFromDraggableId(result.draggableId)
        const { id: targetColumnId, groupId: targetGroupId } = getId(
          destination.droppableId,
        )
        // 只有同列才能拖动
        if (targetColumnId !== sourceColumnId) {
          return
        }
        // draggableId
        dispatch(
          modifyPriority({
            sourceColumnId,
            sourceGroupId,
            targetColumnId,
            targetGroupId,
            startIndex: source.index,
            targetIndex: destination.index,
          }),
        )
      }
    }

    // // 跨容器拖动
    // if (source.droppableId !== destination.droppableId) {
    //   setData(
    //     produce(draft => {
    //       // 获取拖动源数据
    //       const sourceData = draft
    //         .find(item => item.groupId === getId(source.droppableId).groupId)
    //         ?.data.find(item => item.id === getId(source.droppableId).id)
    //       // 获取目标数据
    //       const destinationData = draft
    //         .find(
    //           item => item.groupId === getId(destination.droppableId).groupId,
    //         )
    //         ?.data.find(item => item.id === getId(destination.droppableId).id)
    //       // 源移除的卡片数据
    //       const [removed] = sourceData?.list?.splice(source.index, 1) ?? []
    //       // 移除的卡片数据插入目标中
    //       if (removed) {
    //         destinationData?.list?.splice(destination.index, 0, removed)
    //       }
    //     }),
    //   )
    //   return
    // }
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
    data: kanbanInfoByGroup,
    onDragEnd,
    onDragStart,
  }
}

export default useKanBanData
