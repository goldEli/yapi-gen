import styled from '@emotion/styled'
import React from 'react'
import { useDragLayer, XYCoord } from 'react-dnd'

function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / 32) * 32
  const snappedY = Math.round(y / 32) * 32
  return [snappedX, snappedY]
}

interface CustomDragLayerProps {}
const Box = styled.div`
  width: calc(100% - 58px - 288px - 24px - 24px);
  height: 102px;
  background: var(--primary-d1);
  border-radius: 6px 6px 6px 6px;
  position: fixed;
  pointer-events: none;
  z-index: 100;
  left: 0;
  top: 0;
`

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  //   isSnapToGrid: boolean,
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }

  let { x, y } = currentOffset

  //   if (isSnapToGrid) {
  //     x -= initialOffset.x
  //     y -= initialOffset.y
  //     ;[x, y] = snapToGrid(x, y)
  //     x += initialOffset.x
  //     y += initialOffset.y
  //   }

  const transform = `translate(${initialOffset.x}px, ${y}px)`
  return {
    transform,
    // WebkitTransform: transform,
  }
}

const CustomDragLayer: React.FC<CustomDragLayerProps> = props => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer(monitor => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }))
  console.log(currentOffset)
  return (
    <Box
      className="custom_drag_layer"
      style={getItemStyles(initialOffset, currentOffset)}
    >
      CustomDragLayer
    </Box>
  )
}

export default CustomDragLayer
