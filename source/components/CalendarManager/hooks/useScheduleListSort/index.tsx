import React, { useEffect, useState } from 'react'
import { sortScheduleList } from '../../utils'
import dayjs from 'dayjs'
import { formatYYYYMMDD } from '../../config'
type List = {
  [key in string]: (Model.Schedule.Info | undefined)[]
}
const useScheduleListSort = (
  scheduleList?: API.Schedule.ScheduleListResult,
) => {
  const [list, setList] = useState<List>({})

  useEffect(() => {
    if (!scheduleList) {
      return
    }
    // sort
    const o: List = {}
    for (const key in scheduleList) {
      o[key] = sortScheduleList(scheduleList[key])
    }
    // const res:any = {}

    for (const key in o) {
      // 当天日程
      const currentDayScheduleList = o[key]
      const res: (Model.Schedule.Info | undefined)[] = Array(3).fill(void 0)
      // 处理前三个 跨天，且不是头天，需要玉头天的index保持一致，避免显示错位
      for (let i = 0; i < 3; ++i) {
        const item = currentDayScheduleList[i]
        const isCrossDay = item?.is_span_day
        const isNotFirstDay = !dayjs(item?.start_datetime).isSame(
          dayjs(item?.schedule_start_datetime),
          'day',
        )
        if (isCrossDay && isNotFirstDay) {
          // 获取上一天天的index
          const theDayBefore = dayjs(key).add(-1, 'day').format(formatYYYYMMDD)
          const theDayBeforeScheduleList = o[theDayBefore]
          const index = theDayBeforeScheduleList?.findIndex(
            schedule => schedule?.schedule_id === item.schedule_id,
          )
          res[index] = item
        }
      }

      //  将其他的日程补到res
      if (res.every(r => r === void 0)) {
        o[key] = currentDayScheduleList.slice(0, 3)
      } else {
        // 剩下的日程
        const filtered = currentDayScheduleList.filter(
          l => !res.some(r => r?.schedule_id === l?.schedule_id),
        )
        let idx = 0
        for (let j = 0; j < 3; ++j) {
          if (res[j] === void 0) {
            res[j] = filtered[idx]
            ++idx
          }
        }
        o[key] = res
      }
    }
    setList(o)
  }, [scheduleList])

  return { list }
}

export default useScheduleListSort
