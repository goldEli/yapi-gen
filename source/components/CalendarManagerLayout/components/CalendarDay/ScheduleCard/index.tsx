import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { dragItemTypes, halfHourHeight, oneHourHeight } from '../config'
import Resizer, { TDirection } from '../Resizer'
import {
  addMinutes,
  getEndTimeByHeight,
  getMinutesByDistance,
  getTimeByOffsetDistance,
  hexToRgba,
} from '../utils'
import { DraggableData, Rnd } from 'react-rnd'
import { css } from '@emotion/css'
import { DraggableEvent } from 'react-draggable'
import { setSchedule } from '@store/schedule'

interface ScheduleCardProps {
  data: Model.Schedule.Info
}
const ScheduleContainer = styled.div`
  /* position: relative; */
  /* position: absolute; */
`
// const DragBox = styled.div`
//   width: calc(100% - 58px);
//   background: var(--primary-d1);
//   border-radius: 6px 6px 6px 6px;
//   position: absolute;
//   top: 0px;
//   left: 58px;
//   font-size: 25;
//   min-height: 22px;
//   cursor: move;
//   box-sizing: border-box;
//   padding: 0 4px;
// `
const dragBox = css`
  /* width: calc(100% - 58px); */
  border-radius: 6px 6px 6px 6px;
  /* position: absolute;
  top: 0px;
  left: 58px; */
  font-size: 25;
  min-height: 22px;
  cursor: move;
  box-sizing: border-box;
  padding: 0 4px;
`
const Title = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-n1-d1);
`

const ScheduleCard: React.FC<ScheduleCardProps> = props => {
  const { data } = props
  const { startTime, endTime } = data
  const dispatch = useDispatch()
  const [timeRange, setTimeRange] = useState<{
    startTime: string
    endTime: string
  } | null>(null)
  // const { list } = useSelector(store => store.calendar)
  // const bgColor = useMemo(() => {
  //   return list.find(item => item.is_default === 1)?.color
  // }, [list])

  const height = useMemo(() => {
    const startTimeDayjs = dayjs(startTime)
    const endTimeDayjs = dayjs(endTime)
    const hour = endTimeDayjs.hour() - startTimeDayjs.hour()
    const minute = endTimeDayjs.minute() - startTimeDayjs.minute()
    const allMinutes = hour * 60 + minute
    const newHeight = (allMinutes * oneHourHeight) / 60
    return newHeight
  }, [endTime])

  const top = useMemo(() => {
    const time = dayjs(startTime)
    const hour = time.hour()
    const minute = time.minute()
    const allMinutes = hour * 60 + minute
    return (allMinutes * oneHourHeight) / 60
  }, [startTime])

  const onDrag = (e: DraggableEvent, draggableData: DraggableData) => {
    const { node, y, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(startTime, endTime, y - top)
    setTimeRange({
      startTime: time.startTime.format('hh:mm'),
      endTime: time.endTime.format('hh:mm'),
    })
  }
  const onDragStart = (e: DraggableEvent, draggableData: DraggableData) => {
    // const { node, y, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(startTime, endTime, 0)
    setTimeRange({
      startTime: time.startTime.format('hh:mm'),
      endTime: time.endTime.format('hh:mm'),
    })
  }
  const onDragStop = (e: DraggableEvent, draggableData: DraggableData) => {
    const { node, y, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(startTime, endTime, y - top)
    console.log('time top', dispatch)

    dispatch(
      setSchedule({
        ...props.data,
        startTime: time.startTime.valueOf(),
        endTime: time.endTime.valueOf(),
      }),
    )
    setTimeRange(null)
  }

  const gridHeight = useMemo(() => (oneHourHeight / 60) * 15, [outerHeight])
  return (
    <Rnd
      // id={props.data.id}
      style={{
        background: hexToRgba(data.color, 0.1),
      }}
      className={dragBox}
      key={props.data.id}
      size={{
        width: 1300,
        height,
      }}
      dragGrid={[gridHeight, gridHeight]}
      resizeGrid={[gridHeight, gridHeight]}
      position={{
        x: 58,
        y: top,
      }}
      dragAxis="y"
      enableResizing={{
        bottom: true,
        bottomLeft: false,
        bottomRight: false,
        left: false,
        right: false,
        top: true,
        topLeft: false,
        topRight: false,
      }}
      bounds={document.getElementById('querySelector') as Element}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragStop={onDragStop}
    >
      <Title>
        {timeRange && `${timeRange?.startTime} - ${timeRange?.endTime}`}
      </Title>
      <Title>{props.data.title}</Title>
    </Rnd>
  )
}

export default ScheduleCard
