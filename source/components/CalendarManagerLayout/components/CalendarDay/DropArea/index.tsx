import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { setScheduleList } from '@store/managerCalendar'
import dayjs from 'dayjs'
import React from 'react'
import { useDrop } from 'react-dnd'
import { dragItemTypes, oneHourHeight } from '../config'
import CustomDragLayer from '../CustomDraglayer'

interface DropAreaProps {
  children?: React.ReactNode
}
const Box = styled.div`
  width: 100%;
  position: relative;
`

const DropArea: React.FC<DropAreaProps> = props => {
  const dispatch = useDispatch()
  const scheduleList = useSelector(store => store.managerCalendar.scheduleList)
  const [{ isOver }, drop] = useDrop(() => ({
    accept: dragItemTypes.scheduleCard,
    drop: (item: any, monitor) => {
      const schedule = scheduleList.find(i => i.id === item?.id)
      if (!schedule) {
        return
      }
      const { startTime, endTime } = schedule || {}
      const delta = monitor.getDifferenceFromInitialOffset()
      const offsetTop = Math.round(delta?.y ?? 0)
      const offsetMinute = Math.floor(offsetTop / (oneHourHeight / 60))
      const newStartTime = dayjs(startTime).add(offsetMinute, 'minute')
      const newEndTime = dayjs(endTime).add(offsetMinute, 'minute')
      dispatch(
        setScheduleList({
          ...schedule,
          startTime: newStartTime.format(),
          endTime: newEndTime.format(),
        }),
      )
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
    hover(item, monitor) {
      // console.log(item)
      // 获取每一次放置相对于上一次的偏移量
    },
  }))
  return (
    <Box ref={drop}>
      {props.children}
      <CustomDragLayer />
    </Box>
  )
}

export default DropArea
