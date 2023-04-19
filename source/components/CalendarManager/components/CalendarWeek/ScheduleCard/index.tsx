import React from 'react'
// import { setSchedule } from '@store/schedule'
import useMaxWidth from '../hooks/useMaxWidth'
import MoveCard from '../../MoveCard'
import useMoveCard from '@/components/CalendarManager/hooks/useMoveCard'

interface ScheduleCardProps {
  data: Model.Schedule.Info
  width: number
  left: number
}

const ScheduleCard: React.FC<ScheduleCardProps> = props => {
  const { maxWidth } = useMaxWidth()

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
  } = useMoveCard({ data: props.data })
  return (
    <MoveCard
      timeRange={timeRange}
      data={props.data}
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
    />
  )
}

export default ScheduleCard
