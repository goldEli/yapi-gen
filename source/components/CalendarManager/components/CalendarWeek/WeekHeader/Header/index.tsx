import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import dayjs from 'dayjs'
import React from 'react'
import classnames from 'classnames'

interface WeekHeaderProps {}

const HeaderBox = styled.div`
  display: flex;
  height: 64px;
  font-size: 16px;
  font-weight: 400;
  color: var(--neutral-n1-d1);
`

const TimeZone = styled.div`
  width: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--neutral-n1-d1);
  position: absolute;
  bottom: -12px;
  left: -6px;
`

const WeekList = styled.div`
  flex: 1;
  display: flex;
  box-sizing: border-box;
  padding-left: 58px;
`
const WeekListItem = styled.div`
  flex: 1;
  box-sizing: border-box;
  padding: 6px 12px;

  display: flex;
  flex-direction: column;
  gap: 1px;
  .weekDay {
  }
  .monthDay {
    font-size: 18px;
    font-weight: 500;
  }
  .lunar {
    font-size: 12px;
    font-weight: 400;
    color: var(--neutral-n2);
  }
  .selectedDay {
    display: inline-block;
    width: 28px;
    height: 28px;
    background: var(--primary-d1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--neutral-white-d7) !important;
  }
  .bottom {
    display: flex;
    gap: 9px;
    align-items: center;
  }
  .weekend {
    color: var(--neutral-n4);
  }
`

const Header: React.FC<WeekHeaderProps> = props => {
  const { selectedWeek, selectedDay } = useSelector(store => store.calendar)
  return (
    <HeaderBox>
      <TimeZone>GTM+08</TimeZone>
      <WeekList>
        {selectedWeek.map(item => {
          const date = dayjs(item.date)
          const weekDay = date.format('ddd')
          const monthDay = date.format('DD')
          const currentWeekDayNum = date.format('d')
          // 周六周日
          const weekDayNums = ['0', '6']
          const classname = classnames('monthDay', {
            weekend: weekDayNums.includes(currentWeekDayNum),
            selectedDay:
              date.format('DD/MM/YYYY') ===
              dayjs(selectedDay).format('DD/MM/YYYY'),
          })

          return (
            <WeekListItem key={date.valueOf()}>
              <span
                className={classnames('weekDay', {
                  weekend: weekDayNums.includes(currentWeekDayNum),
                })}
              >
                {weekDay}
              </span>
              <div className="bottom">
                <span className={classname}>{monthDay}</span>
                <span
                  className={classnames('lunar', {
                    weekend: weekDayNums.includes(currentWeekDayNum),
                  })}
                >
                  初一
                </span>
              </div>
            </WeekListItem>
          )
        })}
      </WeekList>
    </HeaderBox>
  )
}

export default Header