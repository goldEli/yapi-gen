import styled from '@emotion/styled'
import React from 'react'
import Timescale from './Timescale'
import WeekHeader from './WeekHeader'

interface CalendarWeekProps {}
const CalendarWeekBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`
const CalendarWeek: React.FC<CalendarWeekProps> = props => {
  return (
    <CalendarWeekBox>
      <WeekHeader />
      <Timescale />
    </CalendarWeekBox>
  )
}

export default CalendarWeek
