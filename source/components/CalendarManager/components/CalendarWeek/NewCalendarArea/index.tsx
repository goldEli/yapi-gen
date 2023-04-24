import dayjs from 'dayjs'
import React from 'react'
import { oneMinuteHeight } from '../../../config'
import usePosition from '../hooks/usePosition'
import { getTimeByAddDistance } from '../utils'
import useWeeks from '../hooks/useWeeks'
import { CreateMoveCardBox } from '@/components/CalendarManager/styles'

interface NewCalendarAreaProps {
  timeZone: string[]
  distance: number
}

const NewCalendarArea: React.FC<NewCalendarAreaProps> = props => {
  const { getLeftByCurrentWeekDay } = useWeeks()

  const startTime = React.useMemo(() => {
    const key = props.timeZone[0]
    return dayjs(key)
  }, [props.timeZone])

  const endTime = React.useMemo(() => {
    if (!startTime) {
      return dayjs(startTime)
    }
    const step = Math.ceil(props.distance / oneMinuteHeight / 15)
    // 起步30分钟
    const dis = Math.max(step * 15, oneMinuteHeight * 15)
    const time = getTimeByAddDistance(startTime.valueOf(), dis)
    return dayjs(time)
  }, [props.distance, startTime])

  const left = React.useMemo(() => {
    const key = props.timeZone[0]
    return getLeftByCurrentWeekDay(dayjs(key).valueOf())
  }, [props.timeZone])

  const { top, height } = usePosition(startTime.valueOf(), endTime.valueOf())

  return (
    <CreateMoveCardBox
      left={58 + left}
      top={top}
      height={height}
      width={'calc((100% - 58px) / 7 - 20px)'}
      className="new-calendar-area"
      visible={!!props.timeZone.length}
    >
      <span className="title">{`${startTime.format('HH:mm')}-${endTime?.format(
        'HH:mm',
      )}`}</span>
    </CreateMoveCardBox>
  )
}

export default NewCalendarArea
