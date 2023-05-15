import styled from '@emotion/styled'
import React, { useMemo } from 'react'
import ScheduleAllDay from './ScheduleAllDay'
import ScheduleCardList from './ScheduleCardList'
import Timescale from './Timescale'
import QuickCreateScheduleModel from '../QuickCreateScheduleModel'
import { useDispatch, useSelector } from '@store/index'
import { getScheduleListDaysOfDate } from '@store/schedule/schedule.thunk'

interface CalendarDayProps {}

const CalendarDayBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* position: relative; */
  /* margin-top: 58px; */
  /* overflow-x: auto; */
`

const CalendarDay: React.FC<CalendarDayProps> = props => {
  const { calenderTypeValue } = useSelector(store => store.calendarPanel)
  const { checkedCalendarList } = useSelector(store => store.calendar)
  const dispatch = useDispatch()

  React.useEffect(() => {
    // dispatch(getScheduleList({ id: 1 }))
    if (!calenderTypeValue) {
      return
    }

    dispatch(
      getScheduleListDaysOfDate({
        date: calenderTypeValue,
        calendar_ids: checkedCalendarList.map(item => item.calendar_id),
      }),
    )
  }, [calenderTypeValue, checkedCalendarList])
  return (
    <CalendarDayBox className="calendar-day-box">
      <ScheduleAllDay />
      <Timescale />
    </CalendarDayBox>
  )
}

export default CalendarDay
