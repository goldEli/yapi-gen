import styled from '@emotion/styled'
import React from 'react'
import Timescale from './Timescale'
import WeekHeader from './WeekHeader'
import { useDispatch, useSelector } from '@store/index'
import { getScheduleListDaysOfWeek } from '@store/schedule/schedule.thunk'

interface CalendarWeekProps {}
const CalendarWeekBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`
const CalendarWeek: React.FC<CalendarWeekProps> = props => {
  const { calenderTypeValue } = useSelector(store => store.calendarPanel)
  const { checkedCalendarList, checkedTime } = useSelector(
    store => store.calendar,
  )
  const dispatch = useDispatch()
  // console.log('chonhgfub/calendar/daysOfWeek')
  React.useEffect(() => {
    if (!calenderTypeValue) {
      return
    }
    const [year, week] = calenderTypeValue.split('/')

    dispatch(
      getScheduleListDaysOfWeek({
        // year: parseInt(year, 10),
        // week: parseInt(week, 10),
        date: calenderTypeValue,
        calendar_ids: checkedCalendarList.map(item => item.calendar_id),
      }),
    )
  }, [calenderTypeValue, checkedCalendarList])
  return (
    <CalendarWeekBox>
      <WeekHeader />
      <Timescale />
    </CalendarWeekBox>
  )
}

export default CalendarWeek
