import React from 'react'
import styled from '@emotion/styled'
import useKanBanData from '../hooks/useKanBanData'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

interface BoardProps {
  children: React.ReactNode
}

const BoardBox = styled.div`
  width: 100%;
  display: flex;
  gap: 19px;
  flex: 1;
  height: 0;
`

const Board: React.FC<BoardProps> = props => {
  const { data, issueColumns, onDragEnd } = useKanBanData()

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={start => {
        console.log(start)
      }}
    >
      <BoardBox>{props.children}</BoardBox>
    </DragDropContext>
  )
}

export default Board
