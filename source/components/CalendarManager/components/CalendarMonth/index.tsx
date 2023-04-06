import styled from '@emotion/styled'
import React from 'react'
import CalendarMonthHeader from './CalendarMonthHeader'
import Content from './Content'

interface CalendarMonthProps {}

const CalendarMonthBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const CalendarMonth: React.FC<CalendarMonthProps> = props => {
  return (
    <CalendarMonthBox>
      <CalendarMonthHeader />
      <Content />
    </CalendarMonthBox>
  )
}

export default CalendarMonth
