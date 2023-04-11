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
// import { setSchedule } from '@store/schedule'
import { ResizeDirection } from 're-resizable'
import usePosition from '../hooks/usePosition'
import { Dropdown } from 'antd'
import ScheduleInfoDropdown from '../../ScheduleInfoDropdown'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import useMaxWidth from '../hooks/useMaxWidth'
import useWeeks from '../hooks/useWeeks'
import { getColorWithOpacityPointOne } from '@/components/CalendarManager/utils'
import { saveSchedule } from '@store/schedule/schedule.thunk'

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
    start_timestamp: string
    end_timestamp: string
  } | null>(null)

  const { height, top } = usePosition(start_timestamp, end_timestamp)

  const { maxWidth } = useMaxWidth()
  const { getCurrentWeekDayByLeft } = useWeeks()
  const isDrag = React.useRef(false)

  const onDrag = (e: DraggableEvent, draggableData: DraggableData) => {
    e.stopPropagation()
    isDrag.current = true
    const { node, y, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(
      start_timestamp,
      end_timestamp,
      y - top,
    )
    setTimeRange({
      start_timestamp: time.start_timestamp.format('HH:mm'),
      end_timestamp: time.end_timestamp.format('HH:mm'),
    })
  }
  const onDragStart = (e: DraggableEvent, draggableData: DraggableData) => {
    e.stopPropagation()
    isDrag.current = false
    // const { node, y, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(start_timestamp, end_timestamp, 0)
    setTimeRange({
      start_timestamp: time.start_timestamp.format('HH:mm'),
      end_timestamp: time.end_timestamp.format('HH:mm'),
    })
  }
  const onDragStop = (e: DraggableEvent, draggableData: DraggableData) => {
    e.stopPropagation()
    const { x, node, y, deltaX, lastY } = draggableData
    const time = getTimeByOffsetDistance(
      start_timestamp,
      end_timestamp,
      y - top,
    )

    // 基于当前的日期更新
    const weekDay = getCurrentWeekDayByLeft(x)
    const newStartTime = dayjs(
      `${weekDay} ${time.start_timestamp.format('HH:mm:ss')}`,
    ).valueOf()
    const newEndTime = dayjs(
      `${weekDay} ${time.end_timestamp.format('HH:mm:ss')}`,
    ).valueOf()

    dispatch(
      saveSchedule({
        ...props.data,
        start_timestamp: newStartTime,
        end_timestamp: newEndTime,
      }),
    )
    setTimeRange(null)
    const calenderBoxRightArea = document.querySelector(
      '#calenderBoxRightArea',
    ) as Element
    // 点击打开详情弹窗, 如果是拖动不打开
    if (!isDrag.current) {
      dispatch(
        setScheduleInfoDropdown({
          id: props.data.schedule_id,
          visible: true,
          x: x + 58 + 20,
          y: y + 20,
        }),
      )
    }
  }

  const onResize = (
    e: MouseEvent | TouchEvent,
    dir: ResizeDirection,
    elementRef: HTMLElement,
    delta: ResizableDelta,
    position: Position,
  ) => {
    e.stopPropagation()
    if (dir === 'bottom') {
      const time = getTimeByAddDistance(end_timestamp, delta.height)
      setTimeRange({
        start_timestamp: dayjs(start_timestamp).format('HH:mm'),
        end_timestamp: time.format('HH:mm'),
      })
    }
    if (dir === 'top') {
      const time = getTimeByAddDistance(start_timestamp, delta.height * -1)
      setTimeRange({
        start_timestamp: time.format('HH:mm'),
        end_timestamp: dayjs(end_timestamp).format('HH:mm'),
      })
    }
  }

  const onResizeStart = (
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
    dir: ResizeDirection,
    elementRef: HTMLElement,
  ) => {
    e.stopPropagation()
    const time = getTimeByOffsetDistance(start_timestamp, end_timestamp, 0)
    setTimeRange({
      start_timestamp: time.start_timestamp.format('HH:mm'),
      end_timestamp: time.end_timestamp.format('HH:mm'),
    })
  }

  const onResizeStop = (
    e: MouseEvent | TouchEvent,
    dir: ResizeDirection,
    elementRef: HTMLElement,
    delta: ResizableDelta,
    position: Position,
  ) => {
    e.stopPropagation()
    if (dir === 'bottom') {
      const time = getTimeByAddDistance(end_timestamp, delta.height)
      dispatch(
        saveSchedule({
          ...props.data,
          end_timestamp: time.valueOf(),
        }),
      )
    }
    if (dir === 'top') {
      const sTime = getTimeByAddDistance(start_timestamp, delta.height * -1)
      // const eTime = getTimeByAddDistance(end_timestamp, delta.height)
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
      onClick={(e: any) => {
        e.stopPropagation()
      }}
      style={{
        background: getColorWithOpacityPointOne(data.color),
      }}
      className={dragBoxClassName}
      key={props.data.id}
      size={{
        width: props.width,
        height,
      }}
      dragGrid={[maxWidth, gridHeight]}
      resizeGrid={[gridHeight, gridHeight]}
      position={{
        x: props.left,
        y: top,
      }}
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
      bounds=".time-scale"
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragStop={onDragStop}
      onResizeStart={onResizeStart}
      onResize={onResize}
      onResizeStop={onResizeStop}
    >
      <Title>
        {timeRange &&
          `${timeRange?.start_timestamp} - ${timeRange?.end_timestamp}`}
      </Title>
      <Title>{props.data.subject}</Title>
    </Rnd>
  )
}

export default ScheduleCard
