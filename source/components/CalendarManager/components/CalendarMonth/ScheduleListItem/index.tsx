import React from 'react'
import {
  getColorWithOpacityPointOne,
  getColor,
} from '@/components/CalendarManager/utils'
import { isSameTime } from '../../CalendarWeek/utils'
import dayjs from 'dayjs'
import { css } from '@emotion/css'
import classNames from 'classnames'
import {
  Dot,
  ScheduleListItemBox,
  Time,
  Title,
  marginLeft,
  marginRight,
} from './styled'
import { useDispatch, useSelector } from '@store/index'
import {
  clearMonthMoveScheduleActiveInfo,
  resizeMonthSchedule,
  setScheduleInfoDropdown,
  // moveMonthSchedule,
  startMoveMonthSchedule,
} from '@store/calendarPanle'
import useScheduleListArr from '../hooks/useScheduleListArr'
import useRelativePosition from '@/components/CalendarManager/hooks/useRelativePosition'

interface ScheduleListItemProps {
  data: Model.Schedule.Info
  idx: number
}

const ScheduleListItem: React.FC<ScheduleListItemProps> = props => {
  const { data } = props
  const { monthMoveScheduleActiveInfo } = useSelector(
    store => store.calendarPanel,
  )
  const { start_timestamp, schedule_start_datetime } = props.data
  const isAllDay = data.is_all_day === 1 || data.is_span_day
  const isAllDayFirstDay =
    isAllDay && isSameTime(start_timestamp, schedule_start_datetime ?? 0)
  const isAllDayButNotFirstDay =
    data.is_span_day &&
    !isSameTime(start_timestamp, schedule_start_datetime ?? 0)
  // 如果是跨天或者全天任务显示全天
  const time = isAllDay ? '全天' : data.start_time
  const isDrag = React.useRef(false)
  const domRef = React.useRef(null)

  const { len } = useScheduleListArr(data.schedule_id)
  const dispatch = useDispatch()
  const { position } = useRelativePosition(
    `${props.data.id}`,
    '.calendar-month-content-box',
  )

  return (
    <ScheduleListItemBox
      ref={domRef}
      onClick={e => {
        e.stopPropagation()
      }}
      visible={
        monthMoveScheduleActiveInfo?.startSchedule?.schedule_id !==
        data.schedule_id
      }
      onMouseDown={e => {
        // e.stopPropagation()
        isDrag.current = false
        window.calendarMonthPanelType = 'move'
        // 时候执行过
        let isRun = false
        const handleMove = (e: MouseEvent) => {
          if (isRun) {
            return
          }
          isRun = true
          isDrag.current = true
          dispatch(
            startMoveMonthSchedule({
              startSchedule: props.data,
              startIndex: props.idx,
              endIndex: props.idx,
              length: len,
            }),
          )
        }
        window.addEventListener('mousemove', handleMove)
        window.addEventListener('mouseup', e => {
          // e.stopPropagation()
          dispatch(clearMonthMoveScheduleActiveInfo())
          window.calendarMonthPanelType = null
          window.removeEventListener('mousemove', handleMove)
          if (!isDrag.current && !isAllDayButNotFirstDay) {
            dispatch(
              setScheduleInfoDropdown({
                show_date: props.data.date,
                schedule_id: props.data.schedule_id,
                visible: true,
                x: position?.x,
                y: position?.y,
              }),
            )
          }
        })
      }}
      id={props.data.id}
      className={classNames({
        [marginLeft]: !isAllDayButNotFirstDay,
        [marginRight]: !(isAllDayButNotFirstDay || isAllDayFirstDay),
      })}
      bg={isAllDay ? getColorWithOpacityPointOne(data.color) : void 0}
      hoverBg={getColorWithOpacityPointOne(data.color)}
      color={getColor(data.color)}
    >
      {!isAllDayButNotFirstDay && (
        <>
          <Dot
            onMouseDown={e => {
              e.stopPropagation()
              window.calendarMonthPanelType = 'resize'
              dispatch(
                resizeMonthSchedule({
                  startSchedule: props.data,
                  startIndex: props.idx,
                  endIndex: props.idx,
                  length: len,
                }),
              )
              window.addEventListener('mouseup', () => {
                dispatch(clearMonthMoveScheduleActiveInfo())
                window.calendarMonthPanelType = null
              })
            }}
            bg={getColor(data.color)}
          />
          <Time className="text">{time}</Time>
          <Title className="text">{props.data.subject}</Title>
        </>
      )}
    </ScheduleListItemBox>
  )
}

export default ScheduleListItem
