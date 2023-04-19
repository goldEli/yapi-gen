import styled from '@emotion/styled'
import dayjs from 'dayjs'
import usePosition from '../hooks/usePosition'
import { useDispatch, useSelector } from '@store/index'
import { setCurrentDate } from '@store/createScheduleVisualization'

import React, { useMemo, useState } from 'react'
import { oneHourHeight } from '../../../../config'
import { getTimeByAddDistance, getTimeByOffsetDistance } from '../utils'
import { DraggableData, Position, ResizableDelta, Rnd } from 'react-rnd'
import { css } from '@emotion/css'
import { DraggableEvent } from 'react-draggable'
import { ResizeDirection } from 're-resizable'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import { saveSchedule } from '@store/schedule/schedule.thunk'
import { getColorWithOpacityPointOne } from '@/components/CalendarManager/utils'

interface NewCalendarAreaProps {
  // data: Model.Schedule.Info
  // width: number
  // left: number
}

const dragBoxClassName = css`
  /* width: calc(100% - 58px); */
  border-radius: 6px 6px 6px 6px;
  /* position: absolute;
  top: 0px;
  left: 58px; */
  font-size: 25;
  min-height: 22px;
  cursor: move;
  box-sizing: border-box;
  padding: 0 4px;
  position: relative;
  z-index: 2;
`
const Title = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-n1-d1);
`

const NewCalendarArea: React.FC<NewCalendarAreaProps> = props => {
  // const { data } = props
  // const { start_timestamp, end_timestamp } = data
  const { calendarData } = useSelector(store => store.calendar)
  const { visualizationTime } = useSelector(store => store.schedule)
  const currentColor = React.useMemo(() => {
    const colorIdx = calendarData.manager.find(
      item => item.is_default === 1,
    )?.color
    return colorIdx
  }, [calendarData])
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (!visualizationTime) {
      return
    }
    const { startTime } = visualizationTime
    dispatch(setCurrentDate(dayjs(startTime).valueOf()))
  }, [visualizationTime])

  const startTime = React.useMemo(() => {
    // const key = props.timeZone[0]
    return dayjs(visualizationTime?.startTime)
  }, [visualizationTime])

  const endTime = React.useMemo(() => {
    return dayjs(visualizationTime?.endTime)
  }, [visualizationTime])

  const { top, height } = usePosition(startTime.valueOf(), endTime.valueOf())
  const [timeRange, setTimeRange] = useState<{
    startTime: string
    endTime: string
  } | null>(null)

  // const { height, top } = usePosition(start_timestamp, end_timestamp)

  const onDrag = (e: DraggableEvent, draggableData: DraggableData) => {
    const { node, y, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(
      startTime.valueOf(),
      endTime.valueOf(),
      y - top,
    )
    setTimeRange({
      startTime: time.startTime.format('HH:mm'),
      endTime: time.endTime.format('HH:mm'),
    })
  }
  const onDragStart = (e: DraggableEvent, draggableData: DraggableData) => {
    // const { node, y, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(
      startTime.valueOf(),
      endTime.valueOf(),
      0,
    )
    setTimeRange({
      startTime: time.startTime.format('HH:mm'),
      endTime: time.endTime.format('HH:mm'),
    })
  }
  const onDragStop = (e: DraggableEvent, draggableData: DraggableData) => {
    const { x, node, y, deltaY, lastY } = draggableData
    const time = getTimeByOffsetDistance(
      startTime.valueOf(),
      endTime.valueOf(),
      y - top,
    )

    // dispatch(
    //   saveSchedule({
    //     ...props.data,
    //     start_timestamp: time.startTime.valueOf(),
    //     end_timestamp: time.endTime.valueOf(),
    //   }),
    // )
    setTimeRange(null)
    const calenderBoxRightArea = document.querySelector(
      '#calenderBoxRightArea',
    ) as Element
    // 打开详情弹窗
    dispatch(
      setScheduleInfoDropdown({
        visible: true,
        x: x + 100,
        y: y + 20,
      }),
    )
  }

  const onResize = (
    e: MouseEvent | TouchEvent,
    dir: ResizeDirection,
    elementRef: HTMLElement,
    delta: ResizableDelta,
    position: Position,
  ) => {
    if (dir === 'bottom') {
      const time = getTimeByAddDistance(endTime.valueOf(), delta.height)
      setTimeRange({
        startTime: startTime.format('HH:mm'),
        endTime: time.format('HH:mm'),
      })
    }
    if (dir === 'top') {
      const time = getTimeByAddDistance(startTime.valueOf(), delta.height * -1)
      setTimeRange({
        startTime: time.format('HH:mm'),
        endTime: endTime.format('HH:mm'),
      })
    }
  }

  const onResizeStart = (
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
    dir: ResizeDirection,
    elementRef: HTMLElement,
  ) => {
    const time = getTimeByOffsetDistance(
      startTime.valueOf(),
      endTime.valueOf(),
      0,
    )
    setTimeRange({
      startTime: time.startTime.format('HH:mm'),
      endTime: time.endTime.format('HH:mm'),
    })
  }

  const onResizeStop = (
    e: MouseEvent | TouchEvent,
    dir: ResizeDirection,
    elementRef: HTMLElement,
    delta: ResizableDelta,
    position: Position,
  ) => {
    if (dir === 'bottom') {
      const time = getTimeByAddDistance(endTime.valueOf(), delta.height)
      // dispatch(
      //   setSchedule({
      //     ...props.data,
      //     endTime: time.valueOf(),
      //   }),
      // )
      // dispatch(
      //   saveSchedule({
      //     ...props.data,
      //     end_timestamp: time.valueOf(),
      //   }),
      // )
    }
    if (dir === 'top') {
      const sTime = getTimeByAddDistance(startTime.valueOf(), delta.height * -1)
      // const eTime = getTimeByAddDistance(endTime, delta.height)
      // dispatch(
      //   setSchedule({
      //     ...props.data,
      //     startTime: sTime.valueOf(),
      //   }),
      // )
      // dispatch(
      //   saveSchedule({
      //     ...props.data,
      //     start_timestamp: sTime.valueOf(),
      //   }),
      // )
    }
    setTimeRange(null)
  }

  const gridHeight = useMemo(() => (oneHourHeight / 60) * 15, [outerHeight])

  const visible = React.useMemo(() => {
    if (!visualizationTime) {
      return false
    }
    // 开始结束时间 没有时分秒 即是全天日程
    // 如果  开始结束时间 时分秒时候相等 即不展示
    if (
      dayjs(visualizationTime.startTime).format('HH:mm:ss') ===
      dayjs(visualizationTime.endTime).format('HH:mm:ss')
    ) {
      return false
    }
    return !!visualizationTime
  }, [visualizationTime])
  if (!visible) {
    return <></>
  }

  return (
    <Rnd
      style={{
        background: getColorWithOpacityPointOne(currentColor ?? 0),
      }}
      className={dragBoxClassName}
      size={{
        width: `400`,
        height,
      }}
      dragGrid={[gridHeight, gridHeight]}
      resizeGrid={[gridHeight, gridHeight]}
      position={{
        x: 58,
        y: top,
      }}
      dragAxis="y"
      disableDragging
      enableResizing={{
        bottom: false,
        bottomLeft: false,
        bottomRight: false,
        left: false,
        right: false,
        top: false,
        topLeft: false,
        topRight: false,
      }}
      bounds=".create-visual-time-scale"
      // onDragStart={onDragStart}
      // onDrag={onDrag}
      // onDragStop={onDragStop}
      // onResizeStart={onResizeStart}
      // onResize={onResize}
      // onResizeStop={onResizeStop}
    >
      <Title>
        {timeRange && `${timeRange?.startTime} - ${timeRange?.endTime}`}
      </Title>
      <Title>{`${startTime.format('HH:mm')}-${endTime?.format(
        'HH:mm',
      )}`}</Title>
    </Rnd>
  )
}

export default NewCalendarArea

// interface NewCalendarAreaProps {
//   // timeZone: string[]
//   // distance: number
// }

// const Box = styled.div`
//   width: calc(100% - 58px);
//   font-size: 12px;
//   line-height: 20px;
//   color: var(--neutral-n1-d1);
//   position: absolute;
//   left: 58px;
//   display: ${(props: { visible: boolean }) =>
//     props.visible ? 'block' : 'none'};
// `
// const Title = styled.span`
//   font-size: 12px;
//   line-height: 20px;
//   color: var(--neutral-n1-d1);
// `

// const NewCalendarArea: React.FC<NewCalendarAreaProps> = props => {
//   // console.table(props.pointerPosition)
//   const { calendarData } = useSelector(store => store.calendar)
//   const { visualizationTime } = useSelector(store => store.schedule)
//   const currentColor = React.useMemo(() => {
//     const colorIdx = calendarData.manager.find(
//       item => item.is_default === 1,
//     )?.color
//     return colorIdx
//   }, [calendarData])
//   const dispatch = useDispatch()

//   React.useEffect(() => {
//     if (!visualizationTime) {
//       return
//     }
//     const { startTime } = visualizationTime
//     dispatch(setCurrentDate(dayjs(startTime).valueOf()))
//   }, [visualizationTime])

//   const startTime = React.useMemo(() => {
//     // const key = props.timeZone[0]
//     return dayjs(visualizationTime?.startTime)
//   }, [visualizationTime])

//   const endTime = React.useMemo(() => {
//     return dayjs(visualizationTime?.endTime)
//   }, [visualizationTime])

//   const { top, height } = usePosition(startTime.valueOf(), endTime.valueOf())

//   const visible = React.useMemo(() => {
//     if (!visualizationTime) {
//       return false
//     }
//     // 开始结束时间 没有时分秒 即是全天日程
//     // 如果  开始结束时间 时分秒时候相等 即不展示
//     if (
//       dayjs(visualizationTime.startTime).format('HH:mm:ss') ===
//       dayjs(visualizationTime.endTime).format('HH:mm:ss')
//     ) {
//       return false
//     }
//     return !!visualizationTime
//   }, [visualizationTime])

//   return (
//     <Box
//       style={{
//         background: getColorWithOpacityPointOne(currentColor ?? 0),
//         top,
//         height,
//       }}
//       className="new-calendar-area"
//       visible={visible}
//     >
//       <Title>{`${startTime.format('HH:mm')}-${endTime?.format(
//         'HH:mm',
//       )}`}</Title>
//     </Box>
//   )
// }

// export default NewCalendarArea
