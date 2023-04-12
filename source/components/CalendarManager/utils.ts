import dayjs from 'dayjs'
import { colorMap, oneMinuteHeight } from './config'

export function getDistanceByTime(time: number) {
  const d = dayjs(time)
  const hour = d.hour()
  const minute = d.minute()

  const allMinute = hour * 60 + minute
  const distance = allMinute * oneMinuteHeight
  return distance
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.substring(1, 3), 16)
  const g = parseInt(hex.substring(3, 5), 16)
  const b = parseInt(hex.substring(5, 7), 16)

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

export function getConflictsTimeRange(list: Model.Schedule.Info[]) {
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
