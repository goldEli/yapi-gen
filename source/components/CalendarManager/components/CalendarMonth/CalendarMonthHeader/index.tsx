import React from 'react'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { css } from '@emotion/css'
import dayjs from 'dayjs'
import classNames from 'classnames'
import { getDaysOfWeekList } from '@store/calendar/calendar.thunk'

interface CalendarMonthHeaderProps {}

const CalendarMonthHeaderBox = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
`
const Item = styled.div`
  flex: 1;
  box-sizing: border-box;
  padding-left: 12px;
  font-size: 16px;
  font-weight: 400;
  color: var(--neutral-n1-d1);
  display: flex;
  align-items: center;
`
const weekendsColor = css`
  color: var(--neutral-n4) !important;
`

const CalendarMonthHeader: React.FC<CalendarMonthHeaderProps> = props => {
  const { selectedWeek } = useSelector(store => store.calendar)
  const { calenderYearWeekValue } = useSelector(store => store.calendarPanel)
  const dispatch = useDispatch()

  // init
  React.useEffect(() => {
    if (!calenderYearWeekValue) {
      return
    }
    const arr = calenderYearWeekValue.split('/')
    const [year, week] = arr

    dispatch(
      getDaysOfWeekList({
        year: parseInt(year, 10),
        week: parseInt(week, 10),
      }),
    )
  }, [calenderYearWeekValue])
  return (
    <CalendarMonthHeaderBox>
      {selectedWeek.map((item, idx) => {
        const dayOfWeek = dayjs(item.date).format('ddd')
        const classnames = classNames({
          [weekendsColor]: idx === 0 || idx === 6,
        })
        return (
          <Item className={classnames} key={item.date}>
            {dayOfWeek}
          </Item>
        )
      })}
    </CalendarMonthHeaderBox>
  )
}

export default CalendarMonthHeader
