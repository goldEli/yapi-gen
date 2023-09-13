import dayjs from 'dayjs'
import useWeeks from './useWeeks'

const useUpdateAllDayTime = () => {
  const { getCurrentWeekDayByLeft } = useWeeks()

  const updateAllDayTime = (options: {
    x: number
    startTime: number
    endTime: number
  }) => {
    const { x, startTime, endTime } = options
    const weekDay = getCurrentWeekDayByLeft(x)
    const newStartTime = dayjs(
      `${weekDay} ${dayjs(startTime).format('HH:mm:ss')}`,
    ).valueOf()
    const newEndTime = dayjs(
      `${weekDay} ${dayjs(endTime).format('HH:mm:ss')}`,
    ).valueOf()
    return {
      startTime: newStartTime,
      endTime: newEndTime,
    }
  }

  return { updateAllDayTime }
}

export default useUpdateAllDayTime
