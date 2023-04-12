import React from 'react'
import { useSelector } from '@store/index'
import dayjs from 'dayjs'

const useScheduleListBySelectedDay = () => {
  const scheduleList = useSelector(store => store.schedule.scheduleList)
  const { checkedTime } = useSelector(store => store.calendar)
  const list = React.useMemo(() => {
    const key = dayjs(checkedTime).format('YYYY-MM-DD')
    return scheduleList[key]?.filter(item => item.is_all_day !== 1)
  }, [scheduleList, checkedTime])
  return { list }
}
export default useScheduleListBySelectedDay
