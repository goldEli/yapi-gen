import styled from '@emotion/styled'
import React, { useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { dragItemTypes } from '../config'

interface ScheduleCardProps {}
const Box = styled.div`
  width: calc(100% - 58px);
  height: 102px;
  background: var(--primary-d1);
  border-radius: 6px 6px 6px 6px;
  position: absolute;
  top: 30px;
  left: 58px;
`

const ScheduleCard: React.FC<ScheduleCardProps> = props => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: dragItemTypes.scheduleCard,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [])
  return (
    <Box
      ref={drag}
      style={{
        opacity: isDragging ? 0 : 1,
        fontSize: 25,
        fontWeight: 'bold',
        cursor: 'move',
      }}
    >
      ScheduleCard
    </Box>
  )
}

export default ScheduleCard
