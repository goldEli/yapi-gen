import { useSelector } from '@store/index'
import dayjs from 'dayjs'
import React from 'react'
import useMaxWidth from '@/components/CalendarManager/hooks/useMaxWith'

const format = 'YYYY-MM-DD'
const useWeeks = () => {
  const { selectedWeek } = useSelector(store => store.calendar)
  const weeks = React.useMemo(
    () => selectedWeek.map(item => dayjs(item.date).format(format)),
    [selectedWeek],
  )

  const { maxWidth: width } = useMaxWidth('.time-scale', 58)
  const maxWidth = React.useMemo(() => {
    return width / 7
  }, [width])

  const getCurrentWeekDayByLeft = (left: number) => {
    let index = 0
    const l = Math.floor(left)
    while (true) {
      if (index === 7) {
        throw new Error('the value of left is error')
      }
      const lessThanLeft = Math.floor(maxWidth * index) <= l
      const biggerThanLeft = Math.floor(maxWidth * (index + 1)) > l
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

  // left方向移动了多少
  const getDeltaLeft = (beforeStartTime: number, afterStartTime: number) => {
    const before = getLeftByCurrentWeekDay(beforeStartTime)
    const after = getLeftByCurrentWeekDay(afterStartTime)
    const delta = (after - before) * maxWidth
    return delta
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
    maxWidth,
    getCurrentWeekDayByLeft,
    getLeftByCurrentWeekDay,
    getTimeAfterAcrossDay,
    getDeltaLeft,
  }
}

export default useWeeks
