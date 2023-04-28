import { useDispatch } from '@store/index'
import React, { useState } from 'react'
import usePosition from '../usePosition'
import { DraggableEvent } from 'react-draggable'
import { DraggableData, Position, ResizableDelta } from 'react-rnd'
import { getTimeByAddDistance, getTimeByOffsetDistance } from '../../utils'
import { modifySchedule } from '@store/schedule/schedule.thunk'
import dayjs from 'dayjs'
import { formatYYYYMMDDhhmmss, oneHourHeight } from '../../config'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import { ResizeDirection } from 're-resizable'
import useWeeks from '../../components/CalendarWeek/hooks/useWeeks'

const useMoveCard = (props: {
  data: Model.Schedule.Info
  type: Model.Calendar.CalendarPanelType
}) => {
  const [localTime, setLocalTime] = useState<{
    start_timestamp: number
    end_timestamp: number
  }>()

  const { start_timestamp = 0, end_timestamp = 0 } = localTime ?? {}
  const dispatch = useDispatch()
  const [timeRange, setTimeRange] = useState<{
    start_timestamp: string
    end_timestamp: string
  } | null>(null)

  const { getTimeAfterAcrossDay } = useWeeks()

  React.useEffect(() => {
    setLocalTime({
      start_timestamp: props.data.start_timestamp,
      end_timestamp: props.data.end_timestamp,
    })
  }, [props.data])

  const { height, top } = usePosition(start_timestamp, end_timestamp)
  const isDrag = React.useRef(false)

  // 拖动时
  const onDrag = (e: DraggableEvent, draggableData: DraggableData) => {
    isDrag.current = true
    e.stopPropagation()
    const { node, y, x, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(
      start_timestamp,
      end_timestamp,
      y - top,
    )

    setTimeRange({
      start_timestamp: time.startTime.format('HH:mm'),
      end_timestamp: time.endTime.format('HH:mm'),
    })
  }

  const onDragStart = (e: DraggableEvent, draggableData: DraggableData) => {
    // const { node, y, deltaY, lastY } = draggableData
    isDrag.current = false
    e.stopPropagation()
    const time = getTimeByOffsetDistance(start_timestamp, end_timestamp, 0)
    setTimeRange({
      start_timestamp: time.startTime.format('HH:mm'),
      end_timestamp: time.endTime.format('HH:mm'),
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
    // 点击打开详情弹窗, 如果是拖动不打开
    // if (!isDrag.current) {
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
    // 没有没有发生位移不进行修改
    if (y - top === 0) {
      setTimeRange(null)
      return
    }
    const time = getTimeByOffsetDistance(
      start_timestamp,
      end_timestamp,
      y - top,
    )
    if (props.type === 'day') {
      onModify(time.startTime.valueOf(), time.endTime.valueOf())
    }

    if (props.type === 'week') {
      // 基于当前的日期更新

      const { newStartTime, newEndTime } = getTimeAfterAcrossDay(
        x,
        time.startTime,
        time.endTime,
      )
      onModify(dayjs(newStartTime).valueOf(), dayjs(newEndTime).valueOf())
    }
    setTimeRange(null)
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
    const time = getTimeByOffsetDistance(start_timestamp, end_timestamp, 0)
    setTimeRange({
      start_timestamp: time.startTime.format('HH:mm'),
      end_timestamp: time.endTime.format('HH:mm'),
    })
  }

  const onResizeStop = (
    e: MouseEvent | TouchEvent,
    dir: ResizeDirection,
    elementRef: HTMLElement,
    delta: ResizableDelta,
    position: Position,
  ) => {
    if (delta.width === 0 && delta.height === 0) {
      setTimeRange(null)
      return
    }
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

  const gridHeight = React.useMemo(
    () => (oneHourHeight / 60) * 15,
    [outerHeight],
  )

  return {
    height,
    top,
    gridHeight,
    timeRange,
    localTime,
    onResizeStop,
    onResizeStart,
    onResize,
    onDragStop,
    onDragStart,
    onDrag,
  }
}

export default useMoveCard
