import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React from 'react'
import { oneMinuteHeight } from '../../../config'
import usePosition from '../hooks/usePosition'
import { getTimeByAddDistance } from '../utils'
import { getColorWithOpacityPointOne } from '../../../utils'
import { useSelector } from '@store/index'
import useMaxWidth from '../hooks/useMaxWidth'
import useWeeks from '../hooks/useWeeks'

interface NewCalendarAreaProps {
  timeZone: string[]
  distance: number
}

// background: getColorWithOpacityPointOne(currentColor ?? 0),
// top,
// height,
const Box = styled.div<{
  visible: boolean
  left: number
  top: number
  height: number
  background: string
}>`
  width: calc((100% - 58px) / 7);
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-n1-d1);
  position: absolute;
  left: ${props => props.left + 'px'};
  display: ${props => (props.visible ? 'block' : 'none')};
  background-color: ${props => props.background};
  top: ${props => props.top + 'px'};
  height: ${props => props.height + 'px'};
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
    const colorIdx = calendarData.manage.find(
      item => item.is_default === 1,
    )?.color
    return colorIdx
  }, [calendarData])

  const { maxWidth } = useMaxWidth()
  const { weeks, getLeftByCurrentWeekDay } = useWeeks()

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
    <Box
      left={58 + left}
      top={top}
      height={height}
      background={getColorWithOpacityPointOne(currentColor ?? 0)}
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
