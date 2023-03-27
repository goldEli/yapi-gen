import dayjs from 'dayjs'
import { XYCoord } from 'react-dnd'
import { oneHourHeight } from './config'
export const handleOffsetDistance = (
  startTime: number,
  endTime: number,
  delta: XYCoord,
) => {
  console.log('==================')
  const offsetTop = Math.round(delta?.y ?? 0)
  console.log('offsetTop', offsetTop)
  const offsetMinute = Math.floor(offsetTop / (oneHourHeight / 60))
  console.log('offsetMinute', offsetMinute)
  // const direction = offsetMinute < 0 ? -1 : 1
  // console.log('direction', direction)
  // 每次移动是15分钟的倍数
  const step = Math.ceil(offsetMinute / 15)
  const moveMinute = step * 15
  console.log('moveMinute', moveMinute)

  const newStartTime = dayjs(startTime).add(moveMinute, 'minute')
  console.log('newStartTime', newStartTime.format('hh:mm'))
  const newEndTime = dayjs(endTime).add(moveMinute, 'minute')
  console.log('newEndTime', newEndTime.format('hh:mm'))
  return {
    newStartTime,
    newEndTime,
  }
}
export const getEndTimeByHeight = (startTime: number, height: number) => {
  // console.log('==================')
  // const offsetTop = Math.round(delta?.y ?? 0)
  // console.log('offsetTop', offsetTop)
  const offsetMinute = Math.floor(height / (oneHourHeight / 60))
  // console.log('offsetMinute', offsetMinute)
  // const direction = offsetMinute < 0 ? -1 : 1
  // console.log('direction', direction)
  // 每次移动是15分钟的倍数
  const step = Math.ceil(offsetMinute / 15)
  const moveMinute = step * 15
  // console.log('moveMinute', moveMinute)

  // const newStartTime = dayjs(startTime).add(moveMinute, 'minute')
  // console.log('newStartTime', newStartTime.format('hh:mm'))
  const newEndTime = dayjs(startTime).add(moveMinute, 'minute')
  console.log(
    'newEndTime',
    dayjs(startTime).format('hh:mm'),
    newEndTime.format('hh:mm'),
  )
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

// 获取元素属性
export function getStyleValue(dom: Element, attr: keyof CSSStyleDeclaration) {
  return parseFloat(getComputedStyle(dom)[attr] + '')
}
