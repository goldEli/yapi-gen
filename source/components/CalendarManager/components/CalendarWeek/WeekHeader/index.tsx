import styled from '@emotion/styled'
import React from 'react'
import Header from './Header'
import AllDayScheduleArea from '../AllDayScheduleArea'

interface WeekHeaderProps {}

const WeekHeaderBox = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  box-sizing: border-box;
  top: -20px;
  left: 0px;
  background: var(--neutral-white-d1);
  z-index: 100;
`

const WeekHeader: React.FC<WeekHeaderProps> = props => {
  return (
    <WeekHeaderBox>
      <Header />
      <AllDayScheduleArea />
    </WeekHeaderBox>
  )
}

export default WeekHeader
