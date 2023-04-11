import React from 'react'
import styled from '@emotion/styled'
import DayItem from './DayItem'
import ScheduleInfoDropdown from '../../ScheduleInfoDropdown'

interface ContentProps {}

const ContentBox = styled.div`
  width: 100%;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  position: relative;
`

const Content: React.FC<ContentProps> = props => {
  return (
    <ContentBox className="calendar-month-content-box">
      {Array(35)
        .fill(0)
        .map((_, idx) => {
          return <DayItem idx={idx} key={idx} />
        })}
      <ScheduleInfoDropdown containerClassName=".calendar-month-content-box" />
    </ContentBox>
  )
}

export default Content
