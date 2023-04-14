import styled from '@emotion/styled'
import { useDispatch } from '@store/index'
import dayjs from 'dayjs'
import React, { useMemo, useState } from 'react'
import { formatYYYYMMDDhhmmss, oneHourHeight } from '../../../config'
import { getTimeByAddDistance, getTimeByOffsetDistance } from '../utils'
import { DraggableData, Position, ResizableDelta, Rnd } from 'react-rnd'
import { css } from '@emotion/css'
import { DraggableEvent } from 'react-draggable'
import { ResizeDirection } from 're-resizable'
import usePosition from '../hooks/usePosition'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import { modifySchedule, saveSchedule } from '@store/schedule/schedule.thunk'
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
const Time = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-n4);
`

const ScheduleCard: React.FC<ScheduleCardProps> = props => {
  const { data } = props
  const [localTime, setLocalTime] = useState<{
    start_timestamp: number
    end_timestamp: number
  }>()

  const { start_timestamp = 0, end_timestamp = 0 } = localTime ?? {}
  const dispatch = useDispatch()
  const [timeRange, setTimeRange] = useState<{
    startTime: string
    endTime: string
  } | null>(null)

  React.useEffect(() => {
    setLocalTime({
      start_timestamp: props.data.start_timestamp,
      end_timestamp: props.data.end_timestamp,
    })
  }, [props.data.end_timestamp, props.data.start_timestamp])

  const { height, top } = usePosition(start_timestamp, end_timestamp)
  const isDrag = React.useRef(false)

  const onDrag = (e: DraggableEvent, draggableData: DraggableData) => {
    isDrag.current = true
    e.stopPropagation()
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
    isDrag.current = false
    e.stopPropagation()
    const time = getTimeByOffsetDistance(start_timestamp, end_timestamp, 0)
    setTimeRange({
      startTime: time.startTime.format('HH:mm'),
      endTime: time.endTime.format('HH:mm'),
    })
  }

  const onModify = (start_timestamp: number, end_timestamp: number) => {
    // 修改日程
    // 修改本地
    setLocalTime({
      start_timestamp,
      end_timestamp,
    })

    // 修改数据库
    const { schedule_id, color, subject, calendar_id } = props.data
    dispatch(
      modifySchedule({
        calendar_id,
        schedule_id,
        color,
        subject,
        start_datetime: dayjs(start_timestamp).format(formatYYYYMMDDhhmmss),
        end_datetime: dayjs(end_timestamp).format(formatYYYYMMDDhhmmss),
      }),
    )
  }

  const onDragStop = (e: DraggableEvent, draggableData: DraggableData) => {
    e.stopPropagation()
    const { x, node, y, deltaX, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(
      start_timestamp,
      end_timestamp,
      y - top,
    )

    onModify(time.startTime.valueOf(), time.endTime.valueOf())

    setTimeRange(null)

    // 点击打开详情弹窗, 如果是拖动不打开
    if (!isDrag.current) {
      dispatch(
        setScheduleInfoDropdown({
          show_date: props.data.date,
          schedule_id: props.data.schedule_id,
          visible: true,
          x: x + 100,
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
      onModify(start_timestamp, time.valueOf())
    }
    if (dir === 'top') {
      const sTime = getTimeByAddDistance(start_timestamp, delta.height * -1)
      onModify(sTime.valueOf(), end_timestamp)
    }
    setTimeRange(null)
  }

  const gridHeight = useMemo(() => (oneHourHeight / 60) * 15, [outerHeight])
  const { is_show_busy } = data

  const content = useMemo(() => {
    if (is_show_busy) {
      return (
        <>
          <Time>{data.start_time}&nbsp;</Time>
          <Title>{data.is_busy_text}</Title>
        </>
      )
    }
    return (
      <>
        <Title>
          {timeRange && `${timeRange?.startTime} - ${timeRange?.endTime} `}
        </Title>
        <Title>{data.subject}</Title>
      </>
    )
  }, [is_show_busy, timeRange, data.subject, data.start_time])

  return (
    <Rnd
      onClick={(e: any) => {
        e.stopPropagation()
      }}
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
      disableDragging={is_show_busy}
      enableResizing={{
        bottom: !is_show_busy,
        bottomLeft: false,
        bottomRight: false,
        left: false,
        right: false,
        top: !is_show_busy,
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
      {content}
    </Rnd>
  )
}

export default ScheduleCard
