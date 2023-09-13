/**
 * 计算日程冲突
 * 得到冲突日程的宽度 以及  left位置
 */
import { useSelector } from '@store/index'
import { useEffect, useState, useMemo } from 'react'
import {
  getConflictsTimeRange,
  getStyleValue,
} from '@/components/CalendarManager/utils'

const minLeft = 58
const useCalculationConflict = () => {
  const { scheduleList } = useSelector(
    store => store.createScheduleVisualization,
  )
  // const { selectedDay } = useSelector(store => store.calendar)
  const [maxWidth, setMaxWidth] = useState(0)
  const [data, setData] = useState<
    { info: Model.Schedule.Info; width: number; left: number }[]
  >([])
  // const key = dayjs(selectedDay).format('YYYY-MM-DD')
  const list = useMemo(
    () =>
      scheduleList?.filter(
        item => item.is_all_day !== 1 && !item.is_span_day,
      ) ?? [],
    [scheduleList],
  )

  useEffect(() => {
    const timeScale = document.querySelector('.create-visual-time-scale')
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
          width: cur.width,
          left: cur.left,
        }
      }
      return {
        info: item,
        width: maxWidth,
        left: minLeft,
      }
    })

    setData(d)
  }, [list, maxWidth, minLeft])

  return { data }
}

export default useCalculationConflict
