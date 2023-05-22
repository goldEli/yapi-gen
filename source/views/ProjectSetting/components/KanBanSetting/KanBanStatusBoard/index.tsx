import React, { useState } from 'react'
import { columnsFromBackend, issueColumns } from './data'
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd'
import ColumnTitleArea from '../ColumnTitleArea'
import useKanBanData from '../hooks/useKanBanData'
import IssuesGroupList from '../IssuesGroupList'
import styled from '@emotion/styled'

const Container = styled.div`
  display: flex;
  gap: 16px;
  height: 100%;
`

const KanBanStatusBoard = () => {
  const { data, issueColumns, onDragEnd } = useKanBanData()

  return (
    // <DragDropContext
    //   onDragEnd={onDragEnd}
    //   onDragStart={start => {
    //     console.log(start)
    //   }}
    // >
    <Droppable droppableId="board" type="COLUMN" direction="horizontal">
      {provided => {
        return (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {issueColumns.map((item, index) => {
              return <ColumnTitleArea key={item.id} index={index} />
            })}
          </Container>
        )
      }}
    </Droppable>
    // </DragDropContext>
  )
}

export default KanBanStatusBoard

// {issueColumns.map((item, index) => {
//   console.log({item})
//   return (
//     <Draggable draggableId={item.id + '1'} key={item.id} index={index}>
//       {(provided, snapshot) => {
//         return (
//           <Container ref={provided.innerRef} {...provided.draggableProps}>
//             <ColumnTitleArea
//               // provided={provided}
//               // snapshot={snapshot}
//               index={index}
//             >
//               {/* <IssuesGroupList index={index} data={data} /> */}
//             </ColumnTitleArea>
//           </Container>
//         )
//       }}
//     </Draggable>
//   )
// })}
