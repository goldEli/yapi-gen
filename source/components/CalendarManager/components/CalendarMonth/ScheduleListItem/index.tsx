import React from 'react'
import styled from '@emotion/styled'

interface ScheduleListItemProps {
  data: Model.Schedule.Info
}

const ScheduleListItemBox = styled.div<{ bg?: string }>`
  width: calc(100% - 4px);
  margin-left: 2px;
  margin-right: 2px;
  background: ${props => props.bg};
  .text {
  }
  &:hover {
    background: var(--function-tag5);
  }
  &:hover .text {
    color: var(--primary-d1);
  }
  display: flex;
  gap: 7px;
  align-items: center;
  cursor: pointer;
`
const Dot = styled.div<{ bg?: string }>`
  width: 6px;
  height: 6px;
  background: ${props => (props.bg ? props.bg : 'var(--primary-d1)')};
  border-radius: 2px 2px 2px 2px;
`
const Time = styled.div`
  color: var(--neutral-n4);
`
const Title = styled.div`
  color: var(--neutral-n2);
`

const ScheduleListItem: React.FC<ScheduleListItemProps> = props => {
  return (
    <ScheduleListItemBox>
      <Dot />
      <Time className="text">00:00</Time>
      <Title className="text">{props.data.subject}</Title>
    </ScheduleListItemBox>
  )
}

export default ScheduleListItem
