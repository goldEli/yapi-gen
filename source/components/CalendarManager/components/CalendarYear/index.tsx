import styled from '@emotion/styled'
import React, { useEffect, useRef } from 'react'
import CalendarForCalendarYear from '../CalendarForCalendarYear'
import { useDispatch, useSelector } from '@store/index'
import { getCalendarDaysOfYearList } from '@store/schedule/schedule.thunk'
import dayjs from 'dayjs'
interface CalendarYearProps {}

const Box = styled.div`
  display: flex;
  gap: 68px;
  flex-wrap: wrap;
`
const CalendarYear: React.FC<CalendarYearProps> = props => {
  const disPatch = useDispatch()
  const { checkedCalendarList } = useSelector(state => state.calendar)
  const checkedCalendarListRef = useRef<Model.Calendar.Info[]>()
  checkedCalendarListRef.current = checkedCalendarList
  const calendarYear = useSelector(
    state => state.calendarPanel.calenderYearValue,
  )
  console.log(
    'checkedCalendarList',
    checkedCalendarList,
    checkedCalendarListRef.current,
  )
  useEffect(() => {
    let params = {
      year: dayjs(calendarYear).year(),
      calendar_ids: checkedCalendarList.map(item => item.calendar_id),
    }
    console.log('params----', params)
    disPatch(getCalendarDaysOfYearList(params))
  }, [calendarYear])
  return (
    <Box>
      {Array(12)
        .fill(0)
        .map((item, idx) => {
          return <CalendarForCalendarYear month={idx} key={idx} />
        })}
    </Box>
  )
}

export default React.memo(CalendarYear)
