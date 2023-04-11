import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React from 'react'
import { oneMinuteHeight } from '../../../config'
import usePosition from '../hooks/usePosition'
import { getTimeByAddDistance } from '../utils'
import { getColorWithOpacityPointOne } from '../../../utils'
import { useSelector } from '@store/index'

interface NewCalendarAreaProps {
  timeZone: string[]
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
const Title = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-n1-d1);
`

const NewCalendarArea: React.FC<NewCalendarAreaProps> = props => {
  // console.table(props.pointerPosition)
  const { calendarData } = useSelector(store => store.calendar)
  const currentColor = React.useMemo(() => {
    const colorIdx = calendarData.manager.find(
      item => item.is_default === 1,
    )?.color
    return colorIdx
  }, [calendarData])

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
      style={{
        background: getColorWithOpacityPointOne(currentColor ?? 0),
        top,
        height,
      }}
      className="new-calendar-area"
      visible={!!props.timeZone.length}
    >
      <Title>{`${startTime.format('HH:mm')}-${endTime?.format(
        'HH:mm',
      )}`}</Title>
    </Box>
  )
}

export default NewCalendarArea
