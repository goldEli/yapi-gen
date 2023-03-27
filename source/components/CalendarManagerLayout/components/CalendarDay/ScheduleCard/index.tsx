import styled from '@emotion/styled'
import { useDispatch } from '@store/index'
import { setSchedule } from '@store/managerCalendar'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { dragItemTypes, halfHourHeight, oneHourHeight } from '../config'
import Resizer, { TDirection } from '../Resizer'
import { getEndTimeByHeight } from '../utils'
import { Rnd } from 'react-rnd'
import { css } from '@emotion/css'

interface ScheduleCardProps {
  data: Model.Calendar.Schedule
}
const ScheduleContainer = styled.div`
  /* position: relative; */
  /* position: absolute; */
`
const DragBox = styled.div`
  width: calc(100% - 58px);
  background: var(--primary-d1);
  border-radius: 6px 6px 6px 6px;
  position: absolute;
  top: 0px;
  left: 58px;
  font-size: 25;
  min-height: 22px;
  cursor: move;
  box-sizing: border-box;
  padding: 0 4px;
`
const dragBox = css`
  /* width: calc(100% - 58px); */
  background: var(--primary-d1);
  border-radius: 6px 6px 6px 6px;
  /* position: absolute;
  top: 0px;
  left: 58px; */
  font-size: 25;
  min-height: 22px;
  cursor: move;
  box-sizing: border-box;
  padding: 0 4px;
`
const Title = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-white-d7);
`

const ScheduleCard: React.FC<ScheduleCardProps> = props => {
  const { data } = props
  const { startTime, endTime } = data
  const [height, setHeight] = useState(0)
  const dispatch = useDispatch()
  const dragBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const startTimeDayjs = dayjs(startTime)
    const endTimeDayjs = dayjs(endTime)
    const hour = endTimeDayjs.hour() - startTimeDayjs.hour()
    const minute = endTimeDayjs.minute() - startTimeDayjs.minute()
    const allMinutes = hour * 60 + minute
    const newHeight = (allMinutes * oneHourHeight) / 60
    setHeight(newHeight)
  }, [startTime, endTime])

  const top = useMemo(() => {
    const time = dayjs(startTime)
    const hour = time.hour()
    const minute = time.minute()
    const allMinutes = hour * 60 + minute
    return (allMinutes * oneHourHeight) / 60
  }, [startTime])

  // const height = useMemo(() => {
  // }, [startTime, endTime])

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: dragItemTypes.scheduleCard,
      item: { id: props.data.id },
      collect: monitor => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [props.data.id],
  )

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  // const onFinish = useCallback(
  //   (direction: TDirection) => {
  //     if (direction === 'bottom') {
  //       console.log('height', height)
  //       dispatch(
  //         setSchedule({
  //           ...props.data,
  //           endTime: getEndTimeByHeight(props.data.startTime, height).valueOf(),
  //         }),
  //       )
  //     }
  //   },
  //   [height],
  // )
  const onFinish = (direction: TDirection) => {
    if (direction === 'bottom') {
      console.log('height onFinish', props.data.id, height)
      dispatch(
        setSchedule({
          ...props.data,
          endTime: getEndTimeByHeight(props.data.startTime, height).valueOf(),
        }),
      )
    }
  }

  // console.log('newHeight', props.data.id, height)
  return (
    <>
      <Rnd
        // id={props.data.id}
        className={dragBox}
        // key={props.data.id}
        size={{
          width: 1300,
          height,
        }}
        position={{
          x: 58,
          y: top,
        }}
        dragAxis="y"
        // style={{
        //   top,
        //   width: '100%',
        // }}
        // default={{
        //   x: 150,
        //   y: 205,
        //   width: 1230,
        //   height: 52,
        // }}
      >
        <Title>{props.data.title}</Title>
      </Rnd>
      {/* <Resizer
        data={props.data}
        top={top}
        height={height}
        onFinish={onFinish}
        onResize={(direction, movementX, movementY) => {
          const dragBox = document.getElementById(props.data.id)
          if (!dragBox) {
            return
          }
          const { height: h, x, y } = dragBox.getBoundingClientRect()

          if (direction === 'top') {
            return
          }
          if (direction === 'bottom') {
            const newHeight = h + movementY

            if (newHeight < halfHourHeight) {
              return
            }
            setHeight(newHeight)
          }
        }}
      /> */}
    </>
  )
}

export default ScheduleCard
