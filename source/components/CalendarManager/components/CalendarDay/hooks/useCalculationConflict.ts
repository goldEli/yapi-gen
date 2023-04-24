/**
 * 计算日程冲突
 * 得到冲突日程的宽度 以及  left位置
 */
import { useEffect, useState, useMemo } from 'react'
import {
  getConflictsTimeRange,
  getStyleValue,
} from '@/components/CalendarManager/utils'
import useScheduleList from './useScheduleList'
import useMaxWidth from '@/components/CalendarManager/hooks/useMaxWith'

const minLeft = 58

const useCalculationConflict = () => {
  const { list } = useScheduleList()
  const [data, setData] = useState<
    { info: Model.Schedule.Info; width: number; left: number }[]
  >([])

  const { maxWidth } = useMaxWidth('.time-scale', minLeft)

  useEffect(() => {
    if (!maxWidth) {
      return
    }
    const conflicts = getConflictsTimeRange(
      list?.sort((a, b) => a.schedule_id - b.schedule_id),
    )

    const conflictsWithSize = conflicts
      .map(con => {
        const len = con.length
        const width = Math.floor((maxWidth - 20) / len)
        return con.map((item, idx) => {
          return {
            id: item.schedule_id,
            width,
            left: minLeft + width * idx,
          }
        })
      })
      .flat()

    const d = list?.map(item => {
      const cur = conflictsWithSize.find(i => i.id === item.schedule_id)
      if (cur) {
        return {
          info: item,
          width: cur.width - 2,
          left: cur.left,
        }
      }
      return {
        info: item,
        width: maxWidth - 20,
        left: minLeft,
      }
    })

    setData(d)
  }, [list, maxWidth, minLeft])

  return { data }
}

export default useCalculationConflict
