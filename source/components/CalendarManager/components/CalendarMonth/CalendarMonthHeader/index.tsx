import React from 'react'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { css } from '@emotion/css'
import dayjs from 'dayjs'
import classNames from 'classnames'

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

// 从星期天开始
const CalendarMonthHeader: React.FC<CalendarMonthHeaderProps> = props => {
  //   const { selectedMonthWeeks } = useSelector(store => store.calendar)
  return (
    <CalendarMonthHeaderBox>
      {Array(7)
        .fill(0)
        .map((item, idx) => {
          const dayOfWeek = dayjs().day(idx).format('ddd')
          const classnames = classNames({
            [weekendsColor]: idx === 0 || idx === 6,
          })
          return (
            <Item className={classnames} key={item}>
              {dayOfWeek}
            </Item>
          )
        })}
    </CalendarMonthHeaderBox>
  )
}

export default CalendarMonthHeader
