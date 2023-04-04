import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { oneHourHeight } from '../../../config'
import {
  getTimeByAddDistance,
  getTimeByOffsetDistance,
  hexToRgba,
  isSameTime,
} from '../utils'
import { DraggableData, Position, ResizableDelta, Rnd } from 'react-rnd'
import { css } from '@emotion/css'
import { DraggableEvent } from 'react-draggable'
import useMaxWidth from '../hooks/useMaxWidth'
import { saveSchedule } from '@store/schedule/schedule.thunk'
import { getColorWithOpacityPointOne } from '@/components/CalendarManager/utils'
import { allDayScheduleListClassName } from '../AllDayScheduleList'
import useUpdateAllDayTime from '../hooks/useUpdateAllDayTime'

export interface ScheduleCardProps {
  data: Model.Schedule.Info
  width: number
  left: number
  top: number
  onChange(data: Model.Schedule.Info, x: number): void
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
  const { data, top } = props
  const { start_timestamp, end_timestamp } = data
  const dispatch = useDispatch()
  const [timeRange, setTimeRange] = useState<{
    start_timestamp: string
    end_timestamp: string
  } | null>(null)

  const { maxWidth } = useMaxWidth()
  const { updateAllDayTime } = useUpdateAllDayTime()

  const onDrag = (e: DraggableEvent, draggableData: DraggableData) => {
    const { x, y, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(
      start_timestamp,
      end_timestamp,
      y - top,
    )
    setTimeRange({
      start_timestamp: time.start_timestamp.format('HH:mm'),
      end_timestamp: time.end_timestamp.format('HH:mm'),
    })
    // 基于当前的日期更新
    const { startTime, endTime } = updateAllDayTime({
      x,
      startTime: time.start_timestamp.valueOf(),
      endTime: time.end_timestamp.valueOf(),
    })
    props.onChange(props.data, x)
  }
  const onDragStart = (e: DraggableEvent, draggableData: DraggableData) => {
    // const { node, y, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(start_timestamp, end_timestamp, 0)
    setTimeRange({
      start_timestamp: time.start_timestamp.format('HH:mm'),
      end_timestamp: time.end_timestamp.format('HH:mm'),
    })
  }
  const onDragStop = (e: DraggableEvent, draggableData: DraggableData) => {
    const { x, node, y, deltaX, lastY } = draggableData
    const time = getTimeByOffsetDistance(
      start_timestamp,
      end_timestamp,
      y - top,
    )

    // 基于当前的日期更新
    const { startTime, endTime } = updateAllDayTime({
      x,
      startTime: time.start_timestamp.valueOf(),
      endTime: time.end_timestamp.valueOf(),
    })
    // const weekDay = getCurrentWeekDayByLeft(x)
    // const newStartTime = dayjs(
    //   `${weekDay} ${time.start_timestamp.format('HH:mm:ss')}`,
    // ).valueOf()
    // const newEndTime = dayjs(
    //   `${weekDay} ${time.end_timestamp.format('HH:mm:ss')}`,
    // ).valueOf()

    dispatch(
      saveSchedule({
        ...props.data,
        start_timestamp: startTime,
        end_timestamp: endTime,
      }),
    )
    setTimeRange(null)
    // const calenderBoxRightArea = document.querySelector(
    //   '#calenderBoxRightArea',
    // ) as Element
    // dispatch(
    //   setScheduleInfoDropdown({
    //     visible: true,
    //     x: x,
    //     y: y,
    //   }),
    // )
  }

  const gridHeight = useMemo(() => (oneHourHeight / 60) * 15, [outerHeight])
  const title = React.useMemo(() => {
    const { start_timestamp, end_timestamp, first_start_timestamp } = props.data
    if (props.data.is_span_day) {
      const isFirstDay = isSameTime(start_timestamp, first_start_timestamp ?? 0)
      if (!isFirstDay) {
        return ''
      }
    }
    return props.data.subject
  }, [props.data])

  // 跨天不是第一天的日程不能拖拽
  const disableDragging = useMemo(() => {
    const { start_timestamp, end_timestamp, first_start_timestamp } = props.data
    const isFirstDay = isSameTime(start_timestamp, first_start_timestamp ?? 0)
    return props.data.is_span_day && !isFirstDay
  }, [props.data])

  return (
    <Rnd
      style={{
        background: getColorWithOpacityPointOne(data.color),
      }}
      className={dragBoxClassName}
      key={props.data.id}
      size={{
        width: props.width,
        height: 20,
      }}
      dragGrid={[maxWidth, gridHeight]}
      // resizeGrid={[gridHeight, gridHeight]}
      dragAxis="x"
      disableDragging={disableDragging}
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
      bounds={`.${allDayScheduleListClassName}`}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragStop={onDragStop}
      // onResizeStart={onResizeStart}
      // onResize={onResize}
      // onResizeStop={onResizeStop}
    >
      {/* <Title>
        {timeRange &&
          `${timeRange?.start_timestamp} - ${timeRange?.end_timestamp}`}
      </Title> */}
      <Title>{title}</Title>
    </Rnd>
  )
}

export default AllDayScheduleCard
