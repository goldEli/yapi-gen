import React, { useState } from 'react'
import styled from '@emotion/styled'
import { columnsFromBackend, issueColumns } from './data'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { getId } from './utils'
import { produce } from 'immer'
import IssuesGroup from './IssuesGroup'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Title = styled.span`
  color: #10957d;
  background: rgba(16, 149, 125, 0.15);
  width: 341px;
  box-sizing: border-box;
  padding: 2px 10px;
  border-radius: 5px;
  align-self: flex-start;
`

const ColumnTitleArea = styled.div`
  display: flex;
  gap: 8px;
`
type InfoItem = {
  issuesId: Model.SprintKanBan.Issues['id']
  visible: boolean
}

const KanBan = () => {
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
      <Container>
        <ColumnTitleArea>
          {issueColumns.map(item => {
            return <Title key={item.id}>{item.title}</Title>
          })}
        </ColumnTitleArea>
        {data.map(issuesGroup => {
          return (
            <IssuesGroup key={issuesGroup.groupId} issuesGroup={issuesGroup} />
          )
        })}
      </Container>
    </DragDropContext>
  )
}

export default KanBan
