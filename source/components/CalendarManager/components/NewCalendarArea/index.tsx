import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React from 'react'
import { oneMinuteHeight } from '../../config'
import usePosition from '../CalendarDay/hooks/usePosition'
import { getTimeByAddDistance, hexToRgba } from '../CalendarDay/utils'

interface NewCalendarAreaProps {
  timeZone: string[]
  color: string
  distance: number
}

const Box = styled.div`
  width: calc(100% - 58px);
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-n1-d1);
  position: absolute;
  left: 58px;
  display: ${(props: { visible: boolean }) =>
    props.visible ? 'block' : 'none'};
`

const NewCalendarArea: React.FC<NewCalendarAreaProps> = props => {
  console.log(props.distance, props.timeZone)
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

  const { top, height } = usePosition(startTime.valueOf(), endTime.valueOf())

  return (
    <Box
      style={{ background: hexToRgba(props.color, 0.1), top, height }}
      visible={!!props.timeZone.length}
    >
      {`${startTime.format('hh:mm')}-${endTime?.format('hh:mm')}`}
    </Box>
  )
}

export default NewCalendarArea
