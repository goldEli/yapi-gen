import React,{useEffect} from 'react'
import { StyledCalendar } from '../../styles'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import dayLocaleData from 'dayjs/plugin/localeData'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import IconFont from '@/components/IconFont'
import { useDispatch, useSelector } from '@store/index'
import { setCheckedTime } from '@store/calendar'
import { getNowDate } from '@/tools'
import {getLeftCalendarDaysOfMonthList} from '@store/schedule/schedule.thunk'
dayjs.extend(dayLocaleData)
const CalendarHeader = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .icon {
    font-size: 16px;
    color: var(--neutral-n1-d1);
    cursor: pointer;
  }
  .time {
    font-size: 16px;
    color: var(--neutral-n1-d1);
    font-family: SiYuanMedium;
  }
`
const DayBox = styled.div`
  width: 24px;
  height: 24px;
  font-size: var(--font14);
  display: flex;
  align-items: center;
  justify-content: center;
`
const dayActive = css`
  border-radius: 50%;
  background: var(--primary-d1);
  color: var(--neutral-white-d7);
  position: relative;
`
const hasScheduleClass = css`
  position: relative;
  &::after {
    position: absolute;
    content: '';
    width: 4px;
    height: 4px;
    background: var(--primary-d1);
    bottom: -4px;
    left: 12px;
    border-radius: 50%;
  }
`
const DXCalendar: React.FC = () => {
  const dispatch = useDispatch()
  const { checkedTime } = useSelector(store => store.calendar);
  const {leftViewScheduleList}=useSelector(state=>state.schedule);
  const wrapperStyle: React.CSSProperties = {
    // width: 240,
    background: 'var(--neutral-n9)',
    //  border: `1px solid ${token.colorBorderSecondary}`,
    //  borderRadius: token.borderRadiusLG,
  }
  
  return (
    <StyledCalendar
      style={wrapperStyle}
      fullscreen={false}
      value={dayjs(checkedTime ? checkedTime : getNowDate())}
      onChange={value => {
        dispatch(setCheckedTime(value.format('YYYY-MM-DD')))
      }}
      // onPanelChange={(value, mode) => {
      //   console.log(value.format('YYYY-MM-DD'), mode)
      // }}
      dateFullCellRender={date => {
        const today =
          dayjs().format('DD/MM/YYYY') === dayjs(date).format('DD/MM/YYYY')
        const hasSchedule =Object.keys(leftViewScheduleList).includes(
          dayjs(date).format('YYYY-MM-DD'),
        )
        return (
          <DayBox
            className={today ? dayActive : hasSchedule ? hasScheduleClass : ''}
          >
            {dayjs(date).date()}
          </DayBox>
        )
      }}
      headerRender={({ value, type, onChange, onTypeChange }) => {
        const month = value.month()
        return (
          <CalendarHeader>
            <span
              className="icon"
              onClick={() => {
                const now = value.clone().month(month - 1)
                onChange(now)
              }}
            >
              <IconFont type="left" />
            </span>
            <span className="time">{value.format('YYYY-MM')}</span>
            <span
              className="icon"
              onClick={() => {
                const now = value.clone().month(month + 1)
                onChange(now)
              }}
            >
              <IconFont type="right" />
            </span>
          </CalendarHeader>
        )
      }}
    />
  )
}

export default DXCalendar
