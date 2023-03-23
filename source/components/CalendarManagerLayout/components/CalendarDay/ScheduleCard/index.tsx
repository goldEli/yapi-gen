import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React, { useEffect, useMemo } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { dragItemTypes, oneHourHeight } from '../config'

interface ScheduleCardProps {
  data: Model.Calendar.Schedule
}
const Box = styled.div`
  width: calc(100% - 58px);
  background: var(--primary-d1);
  border-radius: 6px 6px 6px 6px;
  position: absolute;
  top: 0px;
  left: 58px;
  font-size: 25;
  min-height: 22px;
  cursor: move;
  box-sizing: border-box;
  padding: 0 4px;
`
const Title = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-white-d7);
`

const ScheduleCard: React.FC<ScheduleCardProps> = props => {
  const { data } = props
  const { startTime, endTime } = data

  const top = useMemo(() => {
    const time = dayjs(startTime)
    const hour = time.hour()
    const minute = time.minute()
    const allMinutes = hour * 60 + minute
    return (allMinutes * oneHourHeight) / 60
  }, [startTime])

  const height = useMemo(() => {
    const startTimeDayjs = dayjs(startTime)
    const endTimeDayjs = dayjs(endTime)
    const hour = endTimeDayjs.hour() - startTimeDayjs.hour()
    const minute = endTimeDayjs.minute() - startTimeDayjs.minute()
    const allMinutes = hour * 60 + minute
    return (allMinutes * oneHourHeight) / 60
  }, [startTime, endTime])

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: dragItemTypes.scheduleCard,
    item: { id: props.data.id },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [])
  return (
    <Box
      ref={drag}
      style={{
        opacity: isDragging ? 0 : 1,
        top,
        height,
      }}
    >
      <Title>{props.data.title}</Title>
    </Box>
  )
}

export default ScheduleCard
