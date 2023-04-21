import { useSelector } from '@store/index'
import dayjs from 'dayjs'
import React from 'react'
import useMaxWidth from './useMaxWidth'

const format = 'YYYY-MM-DD'
const useWeeks = () => {
  const { selectedWeek } = useSelector(store => store.calendar)
  const weeks = React.useMemo(
    () => selectedWeek.map(item => dayjs(item.date).format(format)),
    [selectedWeek],
  )

  const { maxWidth } = useMaxWidth()

  const getCurrentWeekDayByLeft = (left: number) => {
    let index = 0
    const l = Math.ceil(left)
    while (true) {
      if (index === 7) {
        throw new Error('the value of left is error')
      }
      const lessThanLeft = Math.ceil(maxWidth * index) <= l
      const biggerThanLeft = Math.ceil(maxWidth * (index + 1)) > l
      if (lessThanLeft && biggerThanLeft) {
        return dayjs(selectedWeek[index].date).format('YYYY-MM-DD')
      }
      ++index
    }
  }

  const getLeftByCurrentWeekDay = (time: number) => {
    const index = selectedWeek.findIndex(item =>
      dayjs(item.date).isSame(dayjs(time), 'day'),
    )
    return index * maxWidth
  }

  // 跨天拖动 计算新的时间
  const getTimeAfterAcrossDay = (
    left: number,
    startTime: dayjs.Dayjs,
    endTime: dayjs.Dayjs,
  ) => {
    const weekDay = getCurrentWeekDayByLeft(left)
    const newStartTime = dayjs(
      `${weekDay} ${startTime.format('HH:mm:ss')}`,
    ).valueOf()
    const newEndTime = dayjs(
      `${weekDay} ${endTime.format('HH:mm:ss')}`,
    ).valueOf()

    return {
      newStartTime,
      newEndTime,
    }
  }

  return {
    weeks,
    getCurrentWeekDayByLeft,
    getLeftByCurrentWeekDay,
    getTimeAfterAcrossDay,
  }
}

export default useWeeks
