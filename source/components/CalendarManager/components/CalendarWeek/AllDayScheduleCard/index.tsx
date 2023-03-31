import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { oneHourHeight } from '../../../config'
import {
  getTimeByAddDistance,
  getTimeByOffsetDistance,
  hexToRgba,
} from '../utils'
import { DraggableData, Position, ResizableDelta, Rnd } from 'react-rnd'
import { css } from '@emotion/css'
import { DraggableEvent } from 'react-draggable'
import { setSchedule } from '@store/schedule'
import { ResizeDirection } from 're-resizable'
import useAllDayPosition from '../hooks/useAllDayPosition'
import { Dropdown } from 'antd'
import ScheduleInfoDropdown from '../../ScheduleInfoDropdown'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import useMaxWidth from '../hooks/useMaxWidth'
import useWeeks from '../hooks/useWeeks'

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
  font-size: 12;
  height: 20px;
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

const AllDayScheduleCard: React.FC<ScheduleCardProps> = props => {
  const { data } = props
  const { startTime, endTime } = data
  const dispatch = useDispatch()
  const [timeRange, setTimeRange] = useState<{
    startTime: string
    endTime: string
  } | null>(null)

  const { height, top } = useAllDayPosition(startTime, endTime)

  const { maxWidth } = useMaxWidth()
  const { getCurrentWeekDayByLeft } = useWeeks()

  const onDrag = (e: DraggableEvent, draggableData: DraggableData) => {
    const { node, y, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(startTime, endTime, y - top)
    setTimeRange({
      startTime: time.startTime.format('HH:mm'),
      endTime: time.endTime.format('HH:mm'),
    })
  }
  const onDragStart = (e: DraggableEvent, draggableData: DraggableData) => {
    // const { node, y, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(startTime, endTime, 0)
    setTimeRange({
      startTime: time.startTime.format('HH:mm'),
      endTime: time.endTime.format('HH:mm'),
    })
  }
  const onDragStop = (e: DraggableEvent, draggableData: DraggableData) => {
    const { x, node, y, deltaX, lastY } = draggableData
    const time = getTimeByOffsetDistance(startTime, endTime, y - top)

    // 基于当前的日期更新
    const weekDay = getCurrentWeekDayByLeft(x)
    const newStartTime = dayjs(
      `${weekDay} ${time.startTime.format('HH:mm:ss')}`,
    ).valueOf()
    const newEndTime = dayjs(
      `${weekDay} ${time.endTime.format('HH:mm:ss')}`,
    ).valueOf()

    dispatch(
      setSchedule({
        ...props.data,
        startTime: newStartTime,
        endTime: newEndTime,
      }),
    )
    setTimeRange(null)
    const calenderBoxRightArea = document.querySelector(
      '#calenderBoxRightArea',
    ) as Element
    // dispatch(
    //   setScheduleInfoDropdown({
    //     visible: true,
    //     x: x,
    //     y: y,
    //   }),
    // )
  }

  const gridHeight = useMemo(() => (oneHourHeight / 60) * 15, [outerHeight])

  return (
    <Rnd
      style={{
        background: hexToRgba(data.color, 0.1),
      }}
      className={dragBoxClassName}
      key={props.data.id}
      size={{
        width: props.width,
        height,
      }}
      dragGrid={[maxWidth, gridHeight]}
      // resizeGrid={[gridHeight, gridHeight]}
      position={{
        x: props.left,
        y: top,
      }}
      enableResizing={{
        bottom: false,
        bottomLeft: false,
        bottomRight: false,
        left: false,
        right: false,
        top: false,
        topLeft: false,
        topRight: false,
      }}
      bounds=".all-day-schedule-list"
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragStop={onDragStop}
      // onResizeStart={onResizeStart}
      // onResize={onResize}
      // onResizeStop={onResizeStop}
    >
      <Title>
        {timeRange && `${timeRange?.startTime} - ${timeRange?.endTime}`}
      </Title>
      <Title>{props.data.title}</Title>
    </Rnd>
  )
}

export default AllDayScheduleCard
