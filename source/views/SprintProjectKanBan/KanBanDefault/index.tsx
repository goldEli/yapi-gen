import React, { useState } from 'react'
import styled from '@emotion/styled'
import { columnsFromBackend, issueColumns } from './data'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { getId } from './utils'
import { produce } from 'immer'
import IssuesGroup from './IssuesGroup'

const Title = styled.span`
  width: 302px;
  height: 48px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
`

const ColumnTitleArea = styled.div`
  display: flex;
  gap: 16px;
`

const KanBanDefault = () => {
  const [data, setData] = useState(columnsFromBackend)

  // refactor with immerjs
  const onDragEnd = (result: DropResult) => {
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

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={start => {
        console.log(start)
      }}
    >
      <ColumnTitleArea>
        {issueColumns.map(item => {
          return <Title key={item.id}>{`${item.title}（${item.total}）`}</Title>
        })}
      </ColumnTitleArea>
      {data.map(issuesGroup => {
        return (
          <IssuesGroup key={issuesGroup.groupId} issuesGroup={issuesGroup} />
        )
      })}
    </DragDropContext>
  )
}

export default KanBanDefault
