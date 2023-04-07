import styled from '@emotion/styled'
import React from 'react'
import CalendarForCalendarYear from '../CalendarForCalendarYear'
interface CalendarYearProps {}

const Box = styled.div`
  display: flex;
  gap: 68px;
  flex-wrap: wrap;
`

const CalendarYear: React.FC<CalendarYearProps> = props => {
  return (
    <Box>
      {Array(11)
        .fill(0)
        .map((item, idx) => {
          return <CalendarForCalendarYear month={idx} key={idx} />
        })}
    </Box>
  )
}

export default CalendarYear
