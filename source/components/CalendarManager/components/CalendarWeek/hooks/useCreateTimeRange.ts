// 推算出开始时间和和高度 推算出结束时间
import {
  formatYYYYMMDDhhmmss,
  oneMinuteHeight,
} from '@/components/CalendarManager/config'
import dayjs from 'dayjs'
import React from 'react'
import { getTimeByAddDistance } from '../utils'

const useCreateTimeRange = (start: string, distance: number) => {
  const endTime = React.useMemo(() => {
    if (!start) {
      return start
    }
    const step = Math.ceil(distance / oneMinuteHeight / 15)
    // 起步30分钟
    const dis = Math.max(step * 15, oneMinuteHeight * 15)
    const time = getTimeByAddDistance(dayjs(start).valueOf(), dis)
    return dayjs(time).format(formatYYYYMMDDhhmmss)
  }, [distance, start])

  return {
    startTime: start,
    endTime,
  }
}

export default useCreateTimeRange
