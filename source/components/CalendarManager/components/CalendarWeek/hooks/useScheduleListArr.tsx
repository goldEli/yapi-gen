import { useSelector } from '@store/index'
import { useMemo } from 'react'

// 获取跨天所有任务
const useScheduleListArr = (id: Model.Schedule.Info['schedule_id']) => {
  const { scheduleList } = useSelector(store => store.schedule)

  const listArr = useMemo(() => {
    const arr = Object.entries(scheduleList).reduce(
      (res: Model.Schedule.Info[], item) => {
        return [...res, ...item[1]]
      },
      [],
    )
    return arr
  }, [scheduleList])

  const len = useMemo(() => {
    return listArr.filter(item => item.schedule_id === id).length
  }, [listArr, id])

  return {
    listArr,
    len,
  }
}

export default useScheduleListArr
