import styled from '@emotion/styled'
import dayjs, { Dayjs } from 'dayjs'
import React, { useState, useEffect } from 'react'
import { useSelector } from '@store/index'
import ScheduleListModal from '../../ScheduleListModal'
interface HeaderRenderProps {
  onChange(date: dayjs.Dayjs): void
  month: number
  value: Dayjs
  onCallBack(data: Dayjs): void
}

const CalendarHeader = styled.div`
  width: 100%;
  height: 40px;
  position: relative;
  font-weight: bold;
`
const HeaderRender: React.FC<HeaderRenderProps> = props => {
  const calenderYearValue = useSelector(
    state => state.calendarPanel.calenderYearValue,
  )
  const scheduleInfo = useSelector(
    state => state.calendarPanel.scheduleInfoDropdown,
  )
  const date = useSelector(state => state.schedule.scheduleDate)

  useEffect(() => {
    let year = dayjs(calenderYearValue)
    props.onCallBack(year)
    props.onChange(year)
  }, [calenderYearValue])
  return (
    <CalendarHeader>
      {`${props.month + 1}月`}
      {props.month === date ? <ScheduleListModal /> : null}
    </CalendarHeader>
  )
}

export default HeaderRender
