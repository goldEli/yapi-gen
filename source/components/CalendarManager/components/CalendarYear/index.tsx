import styled from '@emotion/styled'
import React, { useEffect } from 'react'
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
  const calendarData = useSelector(state => state.calendar.calendarData)
  const calendarYear = useSelector(
    state => state.calendarPanel.calenderYearValue,
  )
  let data = calendarData?.manager.concat(calendarData?.subscribe)
  useEffect(() => {
    let params = {
      year: dayjs(calendarYear).year(),
      calendar_ids: data.map(item => item.calendar_id),
    }
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

export default CalendarYear
