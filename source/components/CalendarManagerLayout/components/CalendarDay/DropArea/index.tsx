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
  const [{ isOver }, drop] = useDrop(
    () => ({
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

        // 每次移动是15分钟的倍数
        const step = Math.ceil(offsetMinute / 15)
        const moveMinute = step * 15

        const newStartTime = dayjs(startTime).add(moveMinute, 'minute')
        const newEndTime = dayjs(endTime).add(moveMinute, 'minute')

        console.log(
          '{ delta }',
          delta?.y,
          offsetMinute,
          dayjs(startTime).format('hh:mm:ss'),
          newStartTime.format('hh:mm:ss'),
          newEndTime.format('hh:mm:ss'),
        )
        dispatch(
          setScheduleList({
            ...schedule,
            startTime: newStartTime.valueOf(),
            endTime: newEndTime.valueOf(),
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
    }),
    [scheduleList],
  )
  return (
    <Box ref={drop}>
      {props.children}
      <CustomDragLayer />
    </Box>
  )
}

export default DropArea
