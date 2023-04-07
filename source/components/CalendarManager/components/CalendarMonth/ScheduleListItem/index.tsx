import React from 'react'
import styled from '@emotion/styled'
import {
  getColorWithOpacityPointOne,
  getColor,
} from '@/components/CalendarManager/utils'
import { isSameTime } from '../../CalendarWeek/utils'
import dayjs from 'dayjs'
import { css } from '@emotion/css'
import classNames from 'classnames'

interface ScheduleListItemProps {
  data: Model.Schedule.Info
}

const ScheduleListItemBox = styled.div<{
  bg?: string
  hoverBg: string
  color: string
}>`
  height: 22px;
  background: ${props => props.bg};
  .text {
  }
  &:hover {
    background: ${props => props.hoverBg};
  }
  &:hover .text {
    color: ${props => props.color};
  }
  display: flex;
  gap: 7px;
  cursor: pointer;
  align-items: center;
`
const marginLeft = css`
  margin-left: 2px;
`

const marginRight = css`
  margin-right: 2px;
`

const Dot = styled.div<{ bg: string }>`
  width: 6px;
  height: 6px;
  background: ${props => props.bg};
  border-radius: 2px 2px 2px 2px;
`
const Time = styled.div`
  color: var(--neutral-n4);
`
const Title = styled.div`
  flex: 1;
  color: var(--neutral-n2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ScheduleListItem: React.FC<ScheduleListItemProps> = props => {
  const { data } = props
  const { start_timestamp, schedule_start_datetime } = props.data
  const isAllDay = data.is_all_day === 1 || data.is_span_day
  const isAllDayFirstDay =
    isAllDay && isSameTime(start_timestamp, schedule_start_datetime ?? 0)
  const isAllDayButNotFirstDay =
    data.is_span_day &&
    !isSameTime(start_timestamp, schedule_start_datetime ?? 0)
  // 如果是跨天或者全天任务显示全天
  const time = isAllDay ? '全天' : data.start_time
  console.log(
    {
      schedule_start_datetime,
      start_timestamp: dayjs(start_timestamp).format('YYYY-MM-DD'),
      isAllDayFirstDay,
      isAllDayButNotFirstDay,
    },
    data.is_span_day,
  )
  return (
    <ScheduleListItemBox
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
          <Dot bg={getColor(data.color)} />
          <Time className="text">{time}</Time>
          <Title className="text">{props.data.subject}</Title>
        </>
      )}
    </ScheduleListItemBox>
  )
}

export default ScheduleListItem
