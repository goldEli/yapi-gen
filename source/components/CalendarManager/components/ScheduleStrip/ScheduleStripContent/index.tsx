import React from 'react'
import styled from '@emotion/styled'
import { Dot, Time, Title } from '../styled'
import { getColor } from '@/components/CalendarManager/utils'
import useShowTime from '@/components/CalendarManager/hooks/useShowTime'

interface ScheduleStripContentProps {
  data?: Model.Schedule.Info
}

const ScheduleStripContentBox = styled.div`
  width: 100%;
`

const ScheduleStripContent: React.FC<ScheduleStripContentProps> = props => {
  const { timeStr } = useShowTime(props?.data)
  return (
    <>
      <Dot bg={getColor(props?.data?.color ?? 0)} />
      <Time className="text">{timeStr}</Time>
      <Title className="text">{props?.data?.subject}</Title>
    </>
  )
}

export default ScheduleStripContent
