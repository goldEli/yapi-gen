import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from '@store/index'
import ScheduleCard from '../ScheduleCard'
// import { getScheduleList } from '@store/schedule/schedule.thunk'
import useCalculationConflict from '../hooks/useCalculationConflict'
import styled from '@emotion/styled'
import { getYearMonthWeekDay } from '@/components/CalendarManager/utils'
import {
  getScheduleListDaysOfDate,
  getScheduleListDaysOfWeek,
} from '@store/schedule/schedule.thunk'

interface ScheduleCardListProps {}
const ScheduleCardListBox = styled.div`
  /* position: relative; */
`

const ScheduleCardList: React.FC<ScheduleCardListProps> = props => {
  const { calenderDayValue } = useSelector(store => store.calendarPanel)
  const { checkedCalendarList } = useSelector(store => store.calendar)
  const { data } = useCalculationConflict()
  const dispatch = useDispatch()

  useEffect(() => {
    // dispatch(getScheduleList({ id: 1 }))
    if (!calenderDayValue) {
      return
    }
    const { week, year } = getYearMonthWeekDay(calenderDayValue)

    dispatch(
      getScheduleListDaysOfDate({
        date: calenderDayValue,
        calendar_ids: checkedCalendarList.map(item => item.calendar_id),
      }),
    )
  }, [calenderDayValue, checkedCalendarList])
  console.log({ data })

  const content = useMemo(() => {
    return data?.map(item => {
      return (
        <ScheduleCard
          key={item.info.id}
          data={item.info}
          width={item.width}
          left={item.left}
        />
      )
    })
  }, [data])
  return <>{content}</>
}

export default ScheduleCardList
