/**
 * 计算日程冲突
 * 得到冲突日程的宽度 以及  left位置
 */

import { useSelector } from '@store/index'
import { useEffect, useState } from 'react'
import { getClassifyConflicts, getConflicts, getStyleValue } from '../utils'

const minLeft = 58
const useCalculationConflict = () => {
  const list = useSelector(store => store.schedule.scheduleList)
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
    const conflicts = getConflicts(list)

    const conflictsWithSize = conflicts
      .map(con => {
        const len = con.length
        const width = Math.floor((maxWidth - 20) / len)
        return con.map((item, idx) => {
          return {
            id: item.id,
            width,
            left: minLeft + width * idx,
          }
        })
      })
      .flat()

    const d = list.map(item => {
      const cur = conflictsWithSize.find(i => i.id === item.id)
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
