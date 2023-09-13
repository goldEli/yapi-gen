import dayjs from 'dayjs'
import React from 'react'
import usePosition from '../hooks/usePosition'
import CreateMoveCardBox from '../../CreateMoveCardBox'

interface NewCalendarAreaProps {
  timeRange: {
    startTime: string
    endTime: string
  }
}

const NewCalendarArea: React.FC<NewCalendarAreaProps> = props => {
  const { startTime, endTime } = props.timeRange

  const { top, height } = usePosition(
    dayjs(startTime).valueOf(),
    dayjs(endTime).valueOf(),
  )

  return (
    <CreateMoveCardBox
      top={top}
      left={58}
      height={height}
      width={'calc(100% - 58px - 20px)'}
      visible={!!props.timeRange.endTime}
      timeRange={props.timeRange}
    ></CreateMoveCardBox>
  )
}

export default NewCalendarArea
