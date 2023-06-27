import dayjs from 'dayjs'
import _ from 'lodash'
import { oneHourHeight } from '../../config'
import { v4 as uuidv4 } from 'uuid'

export const getEndTimeByHeight = (startTime: number, height: number) => {
  // // console.log('==================')
  // const offsetTop = Math.round(delta?.y ?? 0)
  // // console.log('offsetTop', offsetTop)
  const offsetMinute = Math.floor(height / (oneHourHeight / 60))
  // // console.log('offsetMinute', offsetMinute)
  // const direction = offsetMinute < 0 ? -1 : 1
  // // console.log('direction', direction)
  // 每次移动是15分钟的倍数
  const step = Math.ceil(offsetMinute / 15)
  const moveMinute = step * 15
  // // console.log('moveMinute', moveMinute)

  // const newStartTime = dayjs(startTime).add(moveMinute, 'minute')
  // // console.log('newStartTime', newStartTime.format('HH:mm'))
  const newEndTime = dayjs(startTime).add(moveMinute, 'minute')
  // console.log(
  //   'newEndTime',
  //   dayjs(startTime).format('HH:mm'),
  //   newEndTime.format('HH:mm'),
  // )
  return newEndTime
}

export const getMinutesByDistance = (height: number) => {
  return (oneHourHeight / 60) * height
}

export const addMinutes = (time: number, minutes: number) => {
  return dayjs(time).add(minutes, 'minute')
}

export const getTimeByOffsetDistance = (
  startTime: number,
  endTime: number,
  distance: number,
) => {
  const offset = getMinutesByDistance(distance)
  const newStartTime = addMinutes(startTime, offset)
  const newEndTime = addMinutes(endTime, offset)
  return {
    startTime: newStartTime,
    endTime: newEndTime,
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
