import styled from '@emotion/styled'
import React from 'react'
import { useDrop } from 'react-dnd'
import { dragItemTypes } from '../config'

interface DropAreaProps {
  children?: React.ReactNode
}
const Box = styled.div`
  position: relative;
`

const DropArea: React.FC<DropAreaProps> = props => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: dragItemTypes.scheduleCard,
    // drop: () => moveKnight(x, y),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }))
  return <Box ref={drop}>{props.children}</Box>
}

export default DropArea
