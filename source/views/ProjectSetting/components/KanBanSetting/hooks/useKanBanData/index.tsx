import React from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { produce } from 'immer'
import { getId } from '../../utils'
import { issueColumns } from './data'

const useKanBanData = (d: Model.SprintKanBan.IssuesGroup[]) => {
  const [data, setData] = React.useState(d)

  // refactor with immerjs
  const onDragEnd = (result: DropResult) => {
    console.log(result)
    if (!result.destination) return
    const { source, destination } = result

    // 跨容器拖动
    if (source.droppableId !== destination.droppableId) {
      setData(
        produce(draft => {
          // 获取拖动源数据
          const sourceData = draft
            .find(item => item.groupId === getId(source.droppableId).groupId)
            ?.data.find(item => item.id === getId(source.droppableId).id)
          // 获取目标数据
          const destinationData = draft
            .find(
              item => item.groupId === getId(destination.droppableId).groupId,
            )
            ?.data.find(item => item.id === getId(destination.droppableId).id)
          // 源移除的卡片数据
          const [removed] = sourceData?.list?.splice(source.index, 1) ?? []
          // 移除的卡片数据插入目标中
          if (removed) {
            destinationData?.list?.splice(destination.index, 0, removed)
          }
        }),
      )
      return
    }
    setData(
      produce(draft => {
        // 获取拖动源数据
        const sourceData = draft
          .find(item => item.groupId === getId(source.droppableId).groupId)
          ?.data.find(item => item.id === getId(source.droppableId).id)
        // 源移除的卡片数据
        const [removed] = sourceData?.list?.splice(source.index, 1) ?? []
        // 移除的卡片数据插入目标中
        if (removed) {
          sourceData?.list?.splice(destination.index, 0, removed)
        }
      }),
    )
  }

  return {
    data,
    issueColumns,
    onDragEnd,
  }
}

export default useKanBanData
