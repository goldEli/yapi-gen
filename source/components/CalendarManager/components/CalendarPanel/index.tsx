import styled from '@emotion/styled'
import { useSelector, useDispatch } from '@store/index'
import React, { useMemo } from 'react'
import CalendarDay from '../CalendarDay'
import CalendarList from '../CalendarList'
import CalendarMonth from '../CalendarMonth'
import CalendarPanelToolBar from '../CalendarPanelToolBar'
import CalendarWeek from '../CalendarWeek'
import CalendarYear from '../CalendarYear'
import { setScheduleListModal } from '@store/schedule'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import { Spin } from 'antd'
import NewLoadingTransition from '@/components/NewLoadingTransition'
interface CalendarPanelProps {
  children?: React.ReactDOM
}

const Box = styled.div`
  width: 100%;
  /* height: 100%; */
  box-sizing: border-box;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 0px;
  min-width: 1152px;
`

const Content = styled.div`
  width: 100%;
  flex-grow: 1;
  background: #fff;
`

const CalendarPanel: React.FC<CalendarPanelProps> = props => {
  const calendarPanelType = useSelector(
    store => store.calendarPanel.calendarPanelType,
  )
  const calenderTypeValue = useSelector(
    store => store.calendarPanel.calenderTypeValue,
  )
  const { calendarLoading } = useSelector(state => state.calendarPanel)
  const disPatch = useDispatch()
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
  }, [calendarPanelType, calenderTypeValue])

  return (
    <Box
      onClick={() => {
        disPatch(setScheduleListModal({ visible: false, top: 0, left: 0 }))
        disPatch(setScheduleInfoDropdown({ visible: false }))
      }}
    >
      <CalendarPanelToolBar />
      <Spin spinning={calendarLoading} indicator={<NewLoadingTransition />}>
        <Content>{content}</Content>
      </Spin>
    </Box>
  )
}

export default CalendarPanel
