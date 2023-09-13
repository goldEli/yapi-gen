import React from 'react'
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
      resizeGrid={[0, gridHeight]}
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
      dragAxis="y"
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
