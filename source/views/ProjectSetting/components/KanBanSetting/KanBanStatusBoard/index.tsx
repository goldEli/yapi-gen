import React, { useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import ColumnTitleArea from '../ColumnTitleArea'
import useKanBanData from '../hooks/useKanBanData'
import styled from '@emotion/styled'
import { COLUMN } from '../constant'
import CreateColumnBtn from '../CreateColumnBtn'

const Container = styled.div`
  display: flex;
  gap: 16px;
  height: 100%;
`

const KanBanStatusBoard = () => {
  const { columnList } = useKanBanData()

  return (
    <Droppable droppableId={COLUMN} type={COLUMN} direction="horizontal">
      {provided => {
        return (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {columnList.map((item, index) => {
              return <ColumnTitleArea key={item.id} index={index} />
            })}
            <CreateColumnBtn />
          </Container>
        )
      }}
    </Droppable>
  )
}

export default KanBanStatusBoard
