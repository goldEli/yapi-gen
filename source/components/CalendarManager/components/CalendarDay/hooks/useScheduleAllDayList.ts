import React from 'react'
import { useSelector } from '@store/index'
import dayjs from 'dayjs'

const useScheduleAllDayList = () => {
  const { scheduleList } = useSelector(
    store => store.createScheduleVisualization,
  )
  // const { selectedDay } = useSelector(store => store.calendar)
  const list = React.useMemo(() => {
    // const key = dayjs(selectedDay).format('YYYY-MM-DD')
    return scheduleList?.filter(
      item => item.is_all_day === 1 || item.is_span_day,
    )
  }, [scheduleList])
  return { list }
}
export default useScheduleAllDayList
