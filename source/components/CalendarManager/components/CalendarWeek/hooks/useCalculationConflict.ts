/**
 * 计算日程冲突
 * 得到冲突日程的宽度 以及  left位置
 */
// import { useSelector } from '@store/index'
import dayjs from 'dayjs'
import { useEffect, useState, useMemo } from 'react'
// import useMaxWidth from './useMaxWidth'
import useWeeks from './useWeeks'
import useList from './useList'
import { getConflictsTimeRange } from '@/components/CalendarManager/utils'
// import useMaxWidth from '@/components/CalendarManager/hooks/useMaxWith'

const format = 'YYYY-MM-DD'
const useCalculationConflict = () => {
  const { weeks, maxWidth } = useWeeks()
  // const { maxWidth: width } = useMaxWidth('.time-scale', 58)
  // const maxWidth = width / 7
  const [data, setData] = useState<
    { info: Model.Schedule.Info; width: number; left: number }[]
  >([])

  const { list } = useList()

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
    const d = list?.map(item => {
      const cur = conflictsWithSize.find(i => i.id === item.id)
      const str = dayjs(item.start_timestamp).format(format)
      // 根据日期计算出left
      const baseLeft = weeks.findIndex(i => i === str) * maxWidth
      if (cur) {
        return {
          info: item,
          width: cur.width - 2,
          left: baseLeft + cur.left,
        }
      }
      return {
        info: item,
        width: maxWidth - 20,
        left: baseLeft,
      }
    })

    setData(d)
  }, [list, maxWidth, weeks])

  return { data }
}

export default useCalculationConflict
