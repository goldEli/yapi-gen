import styled from '@emotion/styled'
import React, { useMemo } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DropArea from './DropArea'
import ScheduleAllDay from './ScheduleAllDay'
import ScheduleCardList from './ScheduleCardList'
import Timescale from './Timescale'

interface CalendarDayProps {}

const CalendarDayBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 58px;
`

const CalendarDay: React.FC<CalendarDayProps> = props => {
  return (
    <CalendarDayBox className="calendar-day-box">
      {/* <DndProvider backend={HTML5Backend}> */}
      {/* <DropArea> */}
      <ScheduleAllDay />
      <Timescale />
      <ScheduleCardList />
      {/* </DropArea> */}
      {/* </DndProvider> */}
    </CalendarDayBox>
  )
}

export default CalendarDay
