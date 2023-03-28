import dayjs from 'dayjs'
import { useMemo } from 'react'
import { oneHourHeight } from '../config'

const usePosition = (startTime: number, endTime: number) => {
  const height = useMemo(() => {
    const startTimeDayjs = dayjs(startTime)
    const endTimeDayjs = dayjs(endTime)
    const hour = endTimeDayjs.hour() - startTimeDayjs.hour()
    const minute = endTimeDayjs.minute() - startTimeDayjs.minute()
    const allMinutes = hour * 60 + minute
    const newHeight = (allMinutes * oneHourHeight) / 60
    return newHeight
  }, [startTime, endTime])

  const top = useMemo(() => {
    const time = dayjs(startTime)
    const hour = time.hour()
    const minute = time.minute()
    const allMinutes = hour * 60 + minute
    return (allMinutes * oneHourHeight) / 60
  }, [startTime])
  return {
    top,
    height,
  }
}

export default usePosition
