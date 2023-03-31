import styled from '@emotion/styled'
import React, { useMemo } from 'react'
import TimeScale from '../AllDayScheduleAreaTimeScale'
import AllDayScheduleList from '../AllDayScheduleList'

interface WeekHeaderProps {}

const AllDayScheduleAreaBox = styled.div`
  height: 60px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
`

const AllDayScheduleArea: React.FC<WeekHeaderProps> = props => {
  return (
    <AllDayScheduleAreaBox>
      <TimeScale />
      <AllDayScheduleList />
    </AllDayScheduleAreaBox>
  )
}

export default AllDayScheduleArea
