import styled from '@emotion/styled'
import React from 'react'
import TimeScale from './TimeScale'

interface WeekHeaderProps {}

const AllDayScheduleAreaBox = styled.div`
  height: 60px;
`

const AllDayScheduleArea: React.FC<WeekHeaderProps> = props => {
  return (
    <AllDayScheduleAreaBox>
      <TimeScale />
    </AllDayScheduleAreaBox>
  )
}

export default AllDayScheduleArea
