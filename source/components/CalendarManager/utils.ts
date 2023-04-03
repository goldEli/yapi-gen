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
