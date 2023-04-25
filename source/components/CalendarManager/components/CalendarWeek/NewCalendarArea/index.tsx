import dayjs from 'dayjs'
import React from 'react'
import usePosition from '../hooks/usePosition'
import useWeeks from '../hooks/useWeeks'
import CreateMoveCardBox from '../../CreateMoveCardBox'

interface NewCalendarAreaProps {
  timeZone: string[]
  // distance: number
  timeRange: {
    startTime: string
    endTime: string
  }
}

// const step = 15
const NewCalendarArea: React.FC<NewCalendarAreaProps> = props => {
  const { getLeftByCurrentWeekDay } = useWeeks()
  // const schedule_default_duration =
  //   useSelector(
  //     store =>
  //       store.calendar?.calendarConfig?.schedule_configs
  //         ?.schedule_default_duration,
  //   ) ?? 0

  // const startTime = React.useMemo(() => {
  //   const key = props.timeZone[0]
  //   return dayjs(key)
  // }, [props.timeZone])

  // const endTime = React.useMemo(() => {
  //   if (!startTime) {
  //     return dayjs(startTime)
  //   }
  //   // 走了多少步，每步15分钟
  //   const steps = Math.ceil(props.distance / oneMinuteHeight / step)

  //   // 默认创建的时间范围, 如果没有就是30分钟
  //   const defaultTimeRange = schedule_default_duration
  //     ? schedule_default_duration / 60
  //     : 30

  //   const dis = Math.max(steps * step, oneMinuteHeight * defaultTimeRange)
  //   const time = getTimeByAddDistance(startTime.valueOf(), dis)
  //   return dayjs(time)
  // }, [props.distance, startTime, schedule_default_duration])

  const left = React.useMemo(() => {
    const key = props.timeZone[0]
    return getLeftByCurrentWeekDay(dayjs(key).valueOf())
  }, [props.timeZone])
  const { startTime, endTime } = props.timeRange

  const { top, height } = usePosition(
    dayjs(startTime).valueOf(),
    dayjs(endTime).valueOf(),
  )

  return (
    <CreateMoveCardBox
      left={58 + left}
      top={top}
      height={height}
      width={'calc((100% - 58px) / 7 - 20px)'}
      visible={!!props.timeZone.length}
      timeRange={props.timeRange}
    />
  )
}

export default NewCalendarArea
