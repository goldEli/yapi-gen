import React from 'react'
import { useSelector } from '@store/index'

const useScheduleAllDayList = () => {
  const { scheduleList } = useSelector(
    store => store.createScheduleVisualization,
  )
  const list = React.useMemo(() => {
    return scheduleList?.filter(
      item => item.is_all_day === 1 || item.is_span_day,
    )
  }, [scheduleList])
  return { list }
}
export default useScheduleAllDayList
