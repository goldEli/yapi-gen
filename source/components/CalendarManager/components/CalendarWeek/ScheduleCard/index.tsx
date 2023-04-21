import React from 'react'
// import { setSchedule } from '@store/schedule'
import useMaxWidth from '../hooks/useMaxWidth'
import MoveCard from '../../MoveCard'
import useMoveCard from '@/components/CalendarManager/hooks/useMoveCard'
import useWeeks from '../hooks/useWeeks'

interface ScheduleCardProps {
  data: Model.Schedule.Info
  width: number
  left: number
}

const ScheduleCard: React.FC<ScheduleCardProps> = props => {
  const { maxWidth } = useMaxWidth()

  const [localLeft, setLocalLeft] = React.useState(0)
  const { getLeftByCurrentWeekDay } = useWeeks()

  React.useEffect(() => {
    setLocalLeft(props.left)
  }, [props.left])

  const {
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
  } = useMoveCard({ data: props.data, type: 'week' })

  /**
   * 移动后 再后端还未返回数据时，修改该left，避免日程出现跳动问题
   */
  React.useLayoutEffect(() => {
    if (!localTime) {
      return
    }
    const { start_timestamp } = localTime
    const left = getLeftByCurrentWeekDay(start_timestamp)
    setLocalLeft(left)
  }, [localTime])

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
        x: localLeft,
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
