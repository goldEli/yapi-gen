import React from 'react'
import { useSelector } from '@store/index'
import dayjs from 'dayjs'

const useScheduleList = () => {
  const { scheduleList } = useSelector(store => store.schedule)
  const { calenderDayValue } = useSelector(store => store.calendarPanel)
  // const { scheduleList } = useSelector(
  //   store => store.createScheduleVisualization,
  // )
  // const { selectedDay } = useSelector(store => store.calendar)
  const list = React.useMemo(() => {
    const key = dayjs(calenderDayValue).format('YYYY-MM-DD')
    return scheduleList?.[key]?.filter(
      item => item.is_all_day !== 1 || !item.is_span_day,
    )
  }, [scheduleList, calenderDayValue])
  return { list }
}
export default useScheduleList