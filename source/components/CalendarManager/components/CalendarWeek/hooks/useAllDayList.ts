import { useSelector } from '@store/index'
import { useMemo } from 'react'

const useList = () => {
  const { scheduleList } = useSelector(store => store.schedule)
  const allDayScheduleList = useMemo(() => {
    const res = { ...scheduleList }
    for (const key in res) {
      const item = res[key]
      res[key] = item
        .filter(i => i.is_all_day === 1 || i.is_span_day)
        .map((i, idx) => {
          if (idx > 1) {
            return {
              ...i,
              hidden: true,
            }
          }
          return i
        })
    }
    return res
    // return scheduleList.filter(item => item.is_all_day === 1)
  }, [scheduleList])
  const list = useMemo(() => {
    const res: Model.Schedule.Info[] = []
    for (const key in allDayScheduleList) {
      const item = allDayScheduleList[key]
      res.push(...item)
    }

    return res
  }, [allDayScheduleList])
  return { list, allDayScheduleList }
}

export default useList
