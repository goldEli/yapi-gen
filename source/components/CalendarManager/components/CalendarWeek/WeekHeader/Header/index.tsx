import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import classnames from 'classnames'
import { getDaysOfWeekList } from '@store/calendar/calendar.thunk'
import useShowLunar from '@/components/CalendarManager/hooks/useShowLunar'

interface WeekHeaderProps {}

const HeaderBox = styled.div`
  display: flex;
  height: 64px;
  font-size: 16px;

  color: var(--neutral-n1-d1);
`

const TimeZone = styled.div`
  width: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: SiYuanMedium;
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
    font-family: SiYuanMedium;
  }
  .lunar {
    font-size: 12px;

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
  const { selectedWeek, checkedTime } = useSelector(store => store.calendar)
  const { calenderTypeValue } = useSelector(store => store.calendarPanel)
  const dispatch = useDispatch()
  const { showLunar } = useShowLunar()

  // init
  useEffect(() => {
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
            selectedDay: date.isSame(dayjs(checkedTime), 'day'),
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
                {showLunar && (
                  <span
                    className={classnames('lunar', {
                      weekend: weekDayNums.includes(currentWeekDayNum),
                    })}
                  >
                    {item.lunar_day_chinese}
                  </span>
                )}
              </div>
            </WeekListItem>
          )
        })}
      </WeekList>
    </HeaderBox>
  )
}

export default Header
