import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { useDragLayer, XYCoord } from 'react-dnd'
import { oneHourHeight } from '../config'

interface CustomDragLayerProps {}
const Box = styled.div`
  width: calc(100% - 58px - 288px - 24px - 24px);
  height: ${(props: { height: number }) => props.height + 'px'};
  /* height: 102px; */
  background: var(--primary-d1);
  border-radius: 6px 6px 6px 6px;
  position: fixed;
  pointer-events: none;
  z-index: 100;
  min-height: 20px;
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

  // 15分钟对应的高度
  const minHeight = Math.floor((oneHourHeight / 60) * 15)

  // 提取y的负号
  const direction = y >= 0 ? 1 : -1

  // 移动了多少个15分钟, 不足一个，算一个
  const step = Math.ceil(Math.abs(y) / minHeight)

  // y方向移动距离
  const distance = step * minHeight * direction
  // const distance = y
  console.log('current initial', y - initialOffset.y)

  // const transform = `translate(${initialOffset.x}px, ${distance}px)`
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
  const scheduleList = useSelector(store => store.managerCalendar.scheduleList)
  const schedule = useMemo(() => {
    return scheduleList.find(i => i.id === item?.id)
  }, [scheduleList, item])

  const { startTime, endTime } = schedule ?? {}

  const height = useMemo(() => {
    if (!startTime || !endTime) {
      return 0
    }
    const startTimeDayjs = dayjs(startTime)
    const endTimeDayjs = dayjs(endTime)
    const hour = endTimeDayjs.hour() - startTimeDayjs.hour()
    const minute = endTimeDayjs.minute() - startTimeDayjs.minute()
    const allMinutes = hour * 60 + minute
    return (allMinutes * oneHourHeight) / 60
  }, [startTime, endTime])

  return (
    <Box
      height={height}
      className="custom_drag_layer"
      style={getItemStyles(initialOffset, currentOffset)}
    >
      <span>{schedule?.title}</span>
    </Box>
  )
}

export default CustomDragLayer
