import dayjs from 'dayjs'
import {
  colorMap,
  formatYYYYMMDD,
  formatYYYYMMDDhhmmss,
  oneHourHeight,
  oneMinuteHeight,
} from './config'

export function sortScheduleList(list: Model.Schedule.Info[]) {
  // 跨天
  const acrossDay = list?.filter(item => item.is_span_day)
  // 非跨天
  const noneAcrossDay = list?.filter(item => !item.is_span_day)
  // 跨天中的全天
  const acrossDayAndFullDay =
    acrossDay
      ?.filter(item => item.is_all_day === 1)
      ?.sort((a, b) => a.schedule_id - b.schedule_id) ?? []
  // 跨天中的非全天
  const acrossDayAndNoneFullDay =
    acrossDay
      ?.filter(item => item.is_all_day !== 1)
      ?.sort((a, b) => a.schedule_id - b.schedule_id) ?? []
  // 非跨天中的全天
  const noneAcrossAndFullDay =
    noneAcrossDay
      ?.filter(item => item.is_all_day === 1)
      ?.sort((a, b) => a.schedule_id - b.schedule_id) ?? []
  // 非跨天中的非全天
  const noneAcrossAndNoneFullDay =
    noneAcrossDay
      ?.filter(item => item.is_all_day !== 1)
      ?.sort((a, b) => a.schedule_id - b.schedule_id) ?? []

  const newList = [
    ...acrossDayAndFullDay,
    ...acrossDayAndNoneFullDay,
    ...noneAcrossAndFullDay,
    ...noneAcrossAndNoneFullDay,
  ]
  return newList
}

export function getDistanceByTime(time: number) {
  const d = dayjs(time)
  const hour = d.hour()
  const minute = d.minute()

  const allMinute = hour * 60 + minute
  const distance = allMinute * oneMinuteHeight
  return distance
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex?.substring(1, 3), 16)
  const g = parseInt(hex?.substring(3, 5), 16)
  const b = parseInt(hex?.substring(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
export const getColor = (index: number, opacity = 1) => {
  return hexToRgba(colorMap[index], opacity)
}
export const getColorWithOpacityPointOne = (index: number) => {
  return getColor(index, 0.1)
}

// 获取元素属性
export function getStyleValue(dom: Element, attr: keyof CSSStyleDeclaration) {
  return parseFloat(getComputedStyle(dom)[attr] + '')
}

export function getConflictsTimeRange(list?: Model.Schedule.Info[]) {
  if (!list) {
    return []
  }
  const res: Model.Schedule.Info[][] = []
  for (let i = 0; i < list.length; ++i) {
    for (let j = i + 1; j < list.length; ++j) {
      if (
        list[i].start_timestamp < list[j].end_timestamp &&
        list[i].end_timestamp > list[j].start_timestamp
      ) {
        res.push([list[i], list[j]])
      }
    }
  }

  for (let i = 0; i < res.length; ++i) {
    const first = res[i]
    for (let j = 0; j < res.length; ++j) {
      const two = res[j]
      if (first.some(item => two.includes(item))) {
        res[i] = []
        res[j] = [...new Set(first.concat(two))]
      }
    }
  }
  return res.filter(item => item.length)
}

export const getYearMonthWeekDay = (time: string | number) => {
  const d = dayjs(time)
  const year = d.year()
  const month = d.month() + 1
  const week = d.week()
  const day = d.date()

  return {
    year,
    month,
    week,
    day,
  }
}

export const isSameTime = (time1: number | string, time2: number | string) => {
  return dayjs(time1).isSame(dayjs(time2), 'day')
}
export const getMinutesByDistance = (height: number) => {
  return (oneHourHeight / 60) * height
}
export const addMinutes = (time: number, minutes: number) => {
  const currentTime = dayjs(time)
  let newTime = currentTime.add(minutes, 'minute')
  const a = dayjs(currentTime.format(formatYYYYMMDD))
  const b = dayjs(newTime.format(formatYYYYMMDD))
  /**
   * 修改时间处理
   * 不能超过23:59:59，超过了就重置为23:59:59
   * 不能小于00:00:00，小于了就重置为00:00:00
   */
  if (b.isAfter(a)) {
    newTime = dayjs(`${currentTime.format(formatYYYYMMDD)} 23:59:59`)
  }
  if (b.isBefore(a)) {
    newTime = dayjs(`${currentTime.format(formatYYYYMMDD)} 00:00:00`)
  }
  return newTime
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
