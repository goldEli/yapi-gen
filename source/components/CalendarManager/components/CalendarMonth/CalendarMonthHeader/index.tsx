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
  position: sticky;
  left: 0;
  top: 70px;
  background: var(--neutral-white-d1);
  z-index: 100;
`
const Item = styled.div`
  flex: 1;
  box-sizing: border-box;
  padding-left: 12px;
  font-size: 16px;

  color: var(--neutral-n1-d1);
  display: flex;
  align-items: center;
`
const weekendsColor = css`
  color: var(--neutral-n4) !important;
`

const CalendarMonthHeader: React.FC<CalendarMonthHeaderProps> = props => {
  const { selectedWeek, checkedTime } = useSelector(store => store.calendar)
  const { calenderTypeValue } = useSelector(store => store.calendarPanel)
  const dispatch = useDispatch()

  // init
  React.useEffect(() => {
    if (!calenderTypeValue) {
      return
    }
    const arr = calenderTypeValue.split('/')
    const [year, week] = arr

    dispatch(
      getDaysOfWeekList({
        // year: parseInt(year, 10),
        // week: parseInt(week, 10),
        date: calenderTypeValue,
      }),
    )
  }, [calenderTypeValue])
  return (
    <CalendarMonthHeaderBox>
      {selectedWeek.map((item, idx) => {
        const d = dayjs(item.date)
        const dayOfWeek = d.format('ddd')
        const weekNum = d.day()
        const classnames = classNames({
          [weekendsColor]: weekNum === 0 || weekNum === 6,
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
