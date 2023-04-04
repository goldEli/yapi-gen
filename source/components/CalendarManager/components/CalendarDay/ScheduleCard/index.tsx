import styled from '@emotion/styled'
import { useDispatch } from '@store/index'
import dayjs from 'dayjs'
import React, { useMemo, useState } from 'react'
import { oneHourHeight } from '../../../config'
import { getTimeByAddDistance, getTimeByOffsetDistance } from '../utils'
import { DraggableData, Position, ResizableDelta, Rnd } from 'react-rnd'
import { css } from '@emotion/css'
import { DraggableEvent } from 'react-draggable'
import { ResizeDirection } from 're-resizable'
import usePosition from '../hooks/usePosition'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import { saveSchedule } from '@store/schedule/schedule.thunk'
import { getColorWithOpacityPointOne } from '@/components/CalendarManager/utils'

interface ScheduleCardProps {
  data: Model.Schedule.Info
  width: number
  left: number
}

const dragBoxClassName = css`
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
  position: relative;
  z-index: 2;
`
const Title = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-n1-d1);
`

const ScheduleCard: React.FC<ScheduleCardProps> = props => {
  const { data } = props
  const { start_timestamp, end_timestamp } = data
  const dispatch = useDispatch()
  const [timeRange, setTimeRange] = useState<{
    startTime: string
    endTime: string
  } | null>(null)

  const { height, top } = usePosition(start_timestamp, end_timestamp)

  const onDrag = (e: DraggableEvent, draggableData: DraggableData) => {
    const { node, y, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(
      start_timestamp,
      end_timestamp,
      y - top,
    )
    setTimeRange({
      startTime: time.startTime.format('HH:mm'),
      endTime: time.endTime.format('HH:mm'),
    })
  }
  const onDragStart = (e: DraggableEvent, draggableData: DraggableData) => {
    // const { node, y, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(start_timestamp, end_timestamp, 0)
    setTimeRange({
      startTime: time.startTime.format('HH:mm'),
      endTime: time.endTime.format('HH:mm'),
    })
  }
  const onDragStop = (e: DraggableEvent, draggableData: DraggableData) => {
    const { x, node, y, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(
      start_timestamp,
      end_timestamp,
      y - top,
    )

    dispatch(
      saveSchedule({
        ...props.data,
        start_timestamp: time.startTime.valueOf(),
        end_timestamp: time.endTime.valueOf(),
      }),
    )
    setTimeRange(null)
    const calenderBoxRightArea = document.querySelector(
      '#calenderBoxRightArea',
    ) as Element
    // 打开详情弹窗
    dispatch(
      setScheduleInfoDropdown({
        visible: true,
        x: x + 100,
        y: y + 20,
      }),
    )
  }

  const onResize = (
    e: MouseEvent | TouchEvent,
    dir: ResizeDirection,
    elementRef: HTMLElement,
    delta: ResizableDelta,
    position: Position,
  ) => {
    if (dir === 'bottom') {
      const time = getTimeByAddDistance(end_timestamp, delta.height)
      setTimeRange({
        startTime: dayjs(start_timestamp).format('HH:mm'),
        endTime: time.format('HH:mm'),
      })
    }
    if (dir === 'top') {
      const time = getTimeByAddDistance(start_timestamp, delta.height * -1)
      setTimeRange({
        startTime: time.format('HH:mm'),
        endTime: dayjs(end_timestamp).format('HH:mm'),
      })
    }
  }

  const onResizeStart = (
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
    dir: ResizeDirection,
    elementRef: HTMLElement,
  ) => {
    const time = getTimeByOffsetDistance(start_timestamp, end_timestamp, 0)
    setTimeRange({
      startTime: time.startTime.format('HH:mm'),
      endTime: time.endTime.format('HH:mm'),
    })
  }

  const onResizeStop = (
    e: MouseEvent | TouchEvent,
    dir: ResizeDirection,
    elementRef: HTMLElement,
    delta: ResizableDelta,
    position: Position,
  ) => {
    if (dir === 'bottom') {
      const time = getTimeByAddDistance(end_timestamp, delta.height)
      // dispatch(
      //   setSchedule({
      //     ...props.data,
      //     endTime: time.valueOf(),
      //   }),
      // )
      dispatch(
        saveSchedule({
          ...props.data,
          end_timestamp: time.valueOf(),
        }),
      )
    }
    if (dir === 'top') {
      const sTime = getTimeByAddDistance(start_timestamp, delta.height * -1)
      // const eTime = getTimeByAddDistance(endTime, delta.height)
      // dispatch(
      //   setSchedule({
      //     ...props.data,
      //     startTime: sTime.valueOf(),
      //   }),
      // )
      dispatch(
        saveSchedule({
          ...props.data,
          start_timestamp: sTime.valueOf(),
        }),
      )
    }
    setTimeRange(null)
  }

  const gridHeight = useMemo(() => (oneHourHeight / 60) * 15, [outerHeight])

  return (
    <Rnd
      style={{
        background: getColorWithOpacityPointOne(data.color),
      }}
      className={dragBoxClassName}
      key={props.data.schedule_id}
      size={{
        width: props.width,
        height,
      }}
      dragGrid={[gridHeight, gridHeight]}
      resizeGrid={[gridHeight, gridHeight]}
      position={{
        x: props.left,
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
      bounds=".calendar-day-box"
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragStop={onDragStop}
      onResizeStart={onResizeStart}
      onResize={onResize}
      onResizeStop={onResizeStop}
    >
      <Title>
        {timeRange && `${timeRange?.startTime} - ${timeRange?.endTime}`}
      </Title>
      <Title>{props.data.subject}</Title>
    </Rnd>
  )
}

export default ScheduleCard
