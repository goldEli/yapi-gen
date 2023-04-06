import styled from '@emotion/styled'
import dayjs, { Dayjs } from 'dayjs'
import React, { useState, useEffect } from 'react'
import { useSelector } from '@store/index'
import ScheduListModal from '../../ScheduleList'
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
`
const HeaderRender: React.FC<HeaderRenderProps> = props => {
  const calenderYearValue = useSelector(
    state => state.calendarPanel.calenderYearValue,
  )

  const calenderYearType = useSelector(
    state => state.calendarPanel.calenderYearType,
  )

  const date = useSelector(state => state.schedule.scheduleDate)

  useEffect(() => {
    const maps = new Map([
      [1, dayjs(props.value).add(1, 'year')],
      [0, dayjs()],
      [-1, dayjs(props.value).subtract(1, 'year')],
    ])
    let years = maps.get(calenderYearType) as Dayjs
    props.onCallBack(years)
    props.onChange(years)
  }, [calenderYearValue])
  return (
    <CalendarHeader>
      {`${props.month + 1}月`}
      {props.month === date ? (
        <ScheduListModal month={props.month + 1} />
      ) : null}
    </CalendarHeader>
  )
}

export default HeaderRender
