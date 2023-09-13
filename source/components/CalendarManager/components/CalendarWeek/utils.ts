import dayjs from 'dayjs'
import _ from 'lodash'
import { oneHourHeight } from '../../config'
import { v4 as uuidv4 } from 'uuid'

export const getEndTimeByHeight = (start_timestamp: number, height: number) => {
  const offsetMinute = Math.floor(height / (oneHourHeight / 60))
  // 每次移动是15分钟的倍数
  const step = Math.ceil(offsetMinute / 15)
  const moveMinute = step * 15
  const newEndTime = dayjs(start_timestamp).add(moveMinute, 'minute')
  return newEndTime
}

export const getMinutesByDistance = (height: number) => {
  return (oneHourHeight / 60) * height
}

export const addMinutes = (time: number, minutes: number) => {
  return dayjs(time).add(minutes, 'minute')
}

export const getTimeByOffsetDistance = (
  start_timestamp: number,
  end_timestamp: number,
  distance: number,
) => {
  const offset = getMinutesByDistance(distance)
  const newStartTime = addMinutes(start_timestamp, offset)
  const newEndTime = addMinutes(end_timestamp, offset)
  return {
    start_timestamp: newStartTime,
    end_timestamp: newEndTime,
  }
}

export const getTimeByAddDistance = (time: number, distance: number) => {
  const offset = getMinutesByDistance(distance)
  const newTime = addMinutes(time, offset)
  return newTime
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex?.substring(1, 3), 16)
  const g = parseInt(hex?.substring(3, 5), 16)
  const b = parseInt(hex?.substring(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const isSameTime = (time1: number, time2: number | string) => {
  return dayjs(time1).isSame(dayjs(time2), 'day')
}
