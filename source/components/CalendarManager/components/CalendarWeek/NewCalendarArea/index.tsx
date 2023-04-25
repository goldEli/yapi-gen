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

const NewCalendarArea: React.FC<NewCalendarAreaProps> = props => {
  const { getLeftByCurrentWeekDay } = useWeeks()

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
