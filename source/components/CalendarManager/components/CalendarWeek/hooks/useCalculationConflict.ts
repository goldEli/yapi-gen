/**
 * 计算日程冲突
 * 得到冲突日程的宽度 以及  left位置
 */
import { useSelector } from '@store/index'
import dayjs from 'dayjs'
import { useEffect, useState, useMemo } from 'react'
import { getConflictsTimeRange, getStyleValue } from '../utils'

const format = 'YYYY-MM-DD'
const useCalculationConflict = () => {
  const scheduleList = useSelector(store => store.schedule.scheduleList)
  const { selectedWeek } = useSelector(store => store.calendar)
  const weeks = useMemo(
    () => selectedWeek.map(item => dayjs(item.date).format(format)),
    [selectedWeek],
  )
  // const scheduleList = useMemo(() => {
  //   return list.filter(item => dayjs(item.startTime).format())
  // }, [list])

  const [maxWidth, setMaxWidth] = useState(0)
  const [data, setData] = useState<
    { info: Model.Schedule.Info; width: number; left: number }[]
  >([])
  const list = useMemo(
    () =>
      scheduleList
        .filter(item => item.is_all_day !== 1)
        .filter(item => weeks.includes(dayjs(item.startTime).format(format))),
    [scheduleList, weeks],
  )

  useEffect(() => {
    const timeScale = document.querySelector('.schedule-card-list-box')
    if (!timeScale) {
      return
    }
    const width = Math.floor(getStyleValue(timeScale, 'width')) / 7
    setMaxWidth(width)
  }, [])

  useEffect(() => {
    if (!maxWidth) {
      return
    }
    // 获取冲突的日程
    const conflicts = getConflictsTimeRange(list)

    // 设置冲突日程的 left 和 width
    const conflictsWithSize = conflicts
      .map(con => {
        const len = con.length
        const width = Math.floor((maxWidth - 20) / len)
        return con.map((item, idx) => {
          return {
            id: item.id,
            width,
            left: width * idx,
          }
        })
      })
      .flat()

    // 设置所有日程的left 和 width
    const d = list.map(item => {
      const cur = conflictsWithSize.find(i => i.id === item.id)
      const str = dayjs(item.startTime).format(format)
      // 根据日期计算出left
      const baseLeft = weeks.findIndex(i => i === str) * maxWidth
      if (cur) {
        return {
          info: item,
          width: cur.width,
          left: baseLeft + cur.left,
        }
      }
      return {
        info: item,
        width: maxWidth,
        left: baseLeft,
      }
    })

    setData(d)
  }, [list, maxWidth, weeks])

  return { data }
}

export default useCalculationConflict
