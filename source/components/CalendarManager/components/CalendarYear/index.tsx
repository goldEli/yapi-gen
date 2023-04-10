import styled from '@emotion/styled'
import React,{useEffect} from 'react'
import CalendarForCalendarYear from '../CalendarForCalendarYear'
import { useDispatch, useSelector } from '@store/index'
import {getCalendarDaysOfYeaList} from '@store/schedule/schedule.thunk'
interface CalendarYearProps {}

const Box = styled.div`
  display: flex;
  gap: 68px;
  flex-wrap: wrap;
`

const CalendarYear: React.FC<CalendarYearProps> = props => {
  const disPatch=useDispatch()
  useEffect(()=>{
    console.log(11111)
    disPatch(getCalendarDaysOfYeaList())
  },[])
  return (
    <Box>
      {Array(12)
        .fill(0)
        .map((item, idx) => {
          return <CalendarForCalendarYear month={idx} key={idx} />
        })}
    </Box>
  )
}

export default CalendarYear
