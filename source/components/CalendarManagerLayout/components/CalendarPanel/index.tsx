import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import React, { useMemo } from 'react'
import CalendarDay from '../CalendarDay'
import CalendarList from '../CalendarList'
import CalendarMonth from '../CalendarMonth'
import CalendarPanelToolBar from '../CalendarPanelToolBar'
import CalendarWeek from '../CalendarWeek'
import CalendarYear from '../CalendarYear'

interface CalendarPanelProps {
  children?: React.ReactDOM
}

const Box = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Content = styled.div`
  width: 100%;
  flex-grow: 1;
`

const CalendarPanel: React.FC<CalendarPanelProps> = props => {
  const calendarPanelType = useSelector(
    store => store.managerCalendar.calendarPanelType,
  )
  const content = useMemo(() => {
    if (calendarPanelType === 'day') {
      return <CalendarDay />
    }
    if (calendarPanelType === 'week') {
      return <CalendarWeek />
    }
    if (calendarPanelType === 'month') {
      return <CalendarMonth />
    }
    if (calendarPanelType === 'list') {
      return <CalendarList />
    }
    return <CalendarYear />
  }, [calendarPanelType])

  return (
    <Box>
      <CalendarPanelToolBar />
      <Content>{content}</Content>
    </Box>
  )
}

export default CalendarPanel
