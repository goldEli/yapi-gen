import styled from '@emotion/styled'
import React from 'react'
import CalendarMonthHeader from './CalendarMonthHeader'
import Content from './Content'
import { useDispatch, useSelector } from '@store/index'
// import { getScheduleList } from '@store/schedule/schedule.thunk'
import { getDaysOfMonthList } from '@store/calendar/calendar.thunk'
import { getScheduleListDaysOfMonth } from '@store/schedule/schedule.thunk'

interface CalendarMonthProps {}

const CalendarMonthBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const CalendarMonth: React.FC<CalendarMonthProps> = props => {
  const dispatch = useDispatch()
  const { calenderMonthValue } = useSelector(store => store.calendarPanel)
  const { checkedCalendarList } = useSelector(store => store.calendar)

  React.useEffect(() => {
    if (!calenderMonthValue) {
      return
    }
    const arr = calenderMonthValue.split('-')
    const [year, month] = arr.map(item => parseInt(item, 10))
    async function run() {
      await dispatch(
        getDaysOfMonthList({
          year,
          month,
        }),
      )
      dispatch(
        getScheduleListDaysOfMonth({
          year,
          month,
          calendar_ids: checkedCalendarList.map(item => item.calendar_id),
        }),
      )
    }
    run()
  }, [calenderMonthValue])

  React.useEffect(() => {
    // dispatch(getScheduleList({ id: 1 }))
  }, [])
  return (
    <CalendarMonthBox>
      <CalendarMonthHeader />
      <Content />
    </CalendarMonthBox>
  )
}

export default CalendarMonth
