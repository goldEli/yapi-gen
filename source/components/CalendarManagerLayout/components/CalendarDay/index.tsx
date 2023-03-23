import styled from '@emotion/styled'
import React, { useMemo } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DropArea from './DropArea'
import ScheduleCard from './ScheduleCard'
import Timescale from './Timescale'

interface CalendarDayProps {}

const CalendarDayBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const CalendarDay: React.FC<CalendarDayProps> = props => {
  return (
    <CalendarDayBox>
      <DndProvider backend={HTML5Backend}>
        <DropArea>
          <Timescale />
          <ScheduleCard />
        </DropArea>
      </DndProvider>
    </CalendarDayBox>
  )
}

export default CalendarDay
