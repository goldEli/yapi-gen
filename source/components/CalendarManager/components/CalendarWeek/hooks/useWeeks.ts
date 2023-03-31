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
  return { weeks, getCurrentWeekDayByLeft }
}

export default useWeeks
