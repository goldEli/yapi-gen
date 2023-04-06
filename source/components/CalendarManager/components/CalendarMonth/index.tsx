import styled from '@emotion/styled'
import React from 'react'
import CalendarMonthHeader from './CalendarMonthHeader'
import Content from './Content'
import { useDispatch } from '@store/index'
import { getScheduleList } from '@store/schedule/schedule.thunk'

interface CalendarMonthProps {}

const CalendarMonthBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const CalendarMonth: React.FC<CalendarMonthProps> = props => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(getScheduleList({ id: 1 }))
  }, [])
  return (
    <CalendarMonthBox>
      <CalendarMonthHeader />
      <Content />
    </CalendarMonthBox>
  )
}

export default CalendarMonth
