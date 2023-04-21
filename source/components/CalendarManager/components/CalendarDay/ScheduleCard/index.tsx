import styled from '@emotion/styled'
import { useDispatch } from '@store/index'
import dayjs from 'dayjs'
import React, { useMemo, useState } from 'react'
import { formatYYYYMMDDhhmmss, oneHourHeight } from '../../../config'
import { getTimeByAddDistance, getTimeByOffsetDistance } from '../utils'
import { DraggableData, Position, ResizableDelta } from 'react-rnd'
import { css } from '@emotion/css'
import { DraggableEvent } from 'react-draggable'
import { ResizeDirection } from 're-resizable'
import usePosition from '../hooks/usePosition'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import { modifySchedule } from '@store/schedule/schedule.thunk'
import useColor from '@/components/CalendarManager/hooks/useColor'
import MoveCard from '../../MoveCard'
import useMoveCard from '@/components/CalendarManager/hooks/useMoveCard'

interface ScheduleCardProps {
  data: Model.Schedule.Info
  width: number
  left: number
}

const ScheduleCard: React.FC<ScheduleCardProps> = props => {
  const {
    height,
    top,
    gridHeight,
    timeRange,
    onResizeStop,
    onResizeStart,
    onResize,
    onDragStop,
    onDragStart,
    onDrag,
  } = useMoveCard({ data: props.data, type: 'day' })
  return (
    <MoveCard
      timeRange={timeRange}
      data={props.data}
      onClick={(e: any) => {
        e.stopPropagation()
      }}
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
      bounds=".calendar-day-box"
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragStop={onDragStop}
      onResizeStart={onResizeStart}
      onResize={onResize}
      onResizeStop={onResizeStop}
    />
  )
}

export default ScheduleCard
