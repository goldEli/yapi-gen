import React from 'react'
import styled from '@emotion/styled'
import {
  getColorWithOpacityPointOne,
  getColor,
} from '@/components/CalendarManager/utils'

interface ScheduleListItemProps {
  data: Model.Schedule.Info
}

const ScheduleListItemBox = styled.div<{
  bg?: string
  hoverBg: string
  color: string
}>`
  width: calc(100% - 4px);
  margin-left: 2px;
  margin-right: 2px;
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
  align-items: center;
  cursor: pointer;
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
  const isAllDay = data.is_all_day === 1 || data.is_span_day
  // 如果是跨天或者全天任务显示全天
  const time = isAllDay ? '全天' : data.start_time
  return (
    <ScheduleListItemBox
      bg={isAllDay ? getColorWithOpacityPointOne(data.color) : void 0}
      hoverBg={getColorWithOpacityPointOne(data.color)}
      color={getColor(data.color)}
    >
      <Dot bg={getColor(data.color)} />
      <Time className="text">{time}</Time>
      <Title className="text">{props.data.subject}</Title>
    </ScheduleListItemBox>
  )
}

export default ScheduleListItem
