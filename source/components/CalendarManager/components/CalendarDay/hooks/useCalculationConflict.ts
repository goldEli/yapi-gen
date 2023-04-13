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

const minLeft = 58
const useCalculationConflict = () => {
  const { list } = useScheduleList()
  const [maxWidth, setMaxWidth] = useState(0)
  const [data, setData] = useState<
    { info: Model.Schedule.Info; width: number; left: number }[]
  >([])

  useEffect(() => {
    const timeScale = document.querySelector('.time-scale')
    if (!timeScale) {
      return
    }
    const width = Math.floor(getStyleValue(timeScale, 'width')) - minLeft
    setMaxWidth(width)
  }, [])

  useEffect(() => {
    if (!maxWidth) {
      return
    }
    const conflicts = getConflictsTimeRange(list)

    const conflictsWithSize = conflicts
      .map(con => {
        const len = con.length
        const gap = 2
        const width = Math.floor((maxWidth - 20) / len) - gap
        return con.map((item, idx) => {
          const deltaLeft = idx * gap
          return {
            id: item.schedule_id,
            width,
            left: minLeft + width * idx + deltaLeft,
          }
        })
      })
      .flat()

    const d = list?.map(item => {
      const cur = conflictsWithSize.find(i => i.id === item.schedule_id)
      if (cur) {
        return {
          info: item,
          width: cur.width,
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
