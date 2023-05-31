import React from 'react'
import { DragStart, DropResult } from 'react-beautiful-dnd'
import { produce } from 'immer'
import { getId } from '../../utils'
import { useDispatch, useSelector } from '@store/index'
import { setMovingStory } from '@store/kanBan'
import useGroupType from '../useGroupType'
import { sortStoryInUserGrouping } from '@store/kanBan/kanBan.thunk'

const useKanBanData = () => {
  const { kanbanInfoByGroup, kanbanConfig } = useSelector(store => store.kanBan)
  const dispatch = useDispatch()
  const { groupType } = useGroupType()

  const getIds = (droppableId: string, draggableId: string) => {
    const { id: columnId, groupId } = getId(droppableId)
    const { id: storyId } = getId(draggableId)
    return {
      storyId,
      columnId,
      groupId,
    }
  }

  const getStory = (droppableId: string, draggableId: string) => {
    const { storyId, columnId, groupId } = getIds(droppableId, draggableId)
    const group = kanbanInfoByGroup.find(group => group.id === groupId)
    const column = group?.columns.find(column => column.id === columnId)
    const story = column?.stories.find(story => story.id === storyId)

    return story
  }

  const onDragStart = (start: DragStart) => {
    console.log('onDragStart', start)
    const { columnId, groupId } = getIds(
      start.source.droppableId,
      start.draggableId,
    )
    const story = getStory(start.source.droppableId, start.draggableId) ?? null
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
    console.log('onDragEnd', result)
    dispatch(setMovingStory(null))
    if (!result.destination) return
    const { source, destination } = result

    /**
     * 人员分组
     */
    if (groupType === 'users') {
      // 拖拽排序
      if (source.droppableId === destination.droppableId) {
        const { storyId, groupId, columnId } = getIds(
          source.droppableId,
          result.draggableId,
        )
        // draggableId
        dispatch(
          sortStoryInUserGrouping({
            groupId,
            columnId,
            storyId,
            startIndex: source.index,
            destinationIndex: destination.index,
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
