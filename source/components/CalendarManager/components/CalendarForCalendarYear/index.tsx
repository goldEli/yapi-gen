import React, { useEffect, useState, useCallback } from 'react'
import { StyledCalendar } from '../../styles'

import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/zh-cn'
import dayLocaleData from 'dayjs/plugin/localeData'
import styled from '@emotion/styled'
import HeaderRender from './HeaderRender'
import { css } from '@emotion/css'
import { setScheduleListModal, setScheduleDate } from '@store/schedule'
import {
  setScheduleInfoDropdown,
  setCalendarPanelType,
} from '@store/calendarPanle'
import { setCheckedTime } from '@store/calendar/index'
import { useDispatch, useSelector } from '@store/index'
import classNames from 'classnames'
dayjs.extend(dayLocaleData)

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
  background: transparent;
  color: var(--primary-d1);
  border: 1px solid var(--primary-d1);
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
    bottom: -6px;
    left: 10px;
    border-radius: 50%;
  }
`
const selectedDateActive = css`
  border-radius: 50%;
  background: var(--primary-d1);
  color: var(--neutral-white-d1);
`
interface CalendarForCalendarYearProps {
  month: number
}
const wrapperStyle: React.CSSProperties = {
  // width: 240,
}

const CalendarForCalendarYear: React.FC<
  CalendarForCalendarYearProps
> = props => {
  //const current = React.useMemo(() => dayjs().month(props.month), [props.month])
  const { yearViewScheduleList } = useSelector(state => state.schedule)
  const [date, setDate] = useState<Dayjs>(dayjs())
  const onCallBack = (date: Dayjs) => {
    setDate(date)
  }
  const { checkedTime } = useSelector(state => state.calendar)
  const disPatch = useDispatch()
  const dateClick = useCallback(
    (e: any, date: any) => {
      let month = props.month
      e.stopPropagation()
      let selectDate = dayjs(date).format('YYYY-MM-DD')
      if (
        !Object.keys(yearViewScheduleList).includes(
          dayjs(date).format('YYYY-MM-DD'),
        )
      )
        return
      // setScheduleDate
      disPatch(
        setScheduleListModal({
          visible: true,
          top: 76,
          left: 0,
          date: dayjs(date).date(),
          scheduleListData: yearViewScheduleList[selectDate],
        }),
      )
      disPatch(setScheduleDate(month))
      disPatch(
        setScheduleInfoDropdown({ visible: false, show_date: selectDate }),
      )
    },
    [yearViewScheduleList],
  )
  return (
    <div style={{ position: 'relative' }}>
      <StyledCalendar
        dateFullCellRender={date => {
          const today =
            dayjs().format('DD/MM/YYYY') === dayjs(date).format('DD/MM/YYYY')
          const hasSchedule = Object.keys(yearViewScheduleList).includes(
            dayjs(date).format('YYYY-MM-DD'),
          )
          const selectedDate = checkedTime === dayjs(date).format('YYYY-MM-DD')
          return (
            <DayBox
              className={classNames({
                [hasScheduleClass]: hasSchedule,
                [selectedDateActive]: selectedDate,
                [dayActive]: today,
              })}
              onDoubleClick={() => {
                disPatch(setCalendarPanelType('month'))
                disPatch(setCheckedTime(dayjs(date).format('YYYY-MM-DD')))
              }}
              onClick={e => dateClick(e, date)}
            >
              {dayjs(date).date()}
            </DayBox>
          )
        }}
        value={date.month(props.month)}
        style={wrapperStyle}
        fullscreen={false}
        onPanelChange={(value, mode) => {}}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          return (
            <HeaderRender
              month={props.month}
              value={value}
              onChange={onChange}
              onCallBack={onCallBack}
            />
          )
        }}
      />
    </div>
  )
}

export default CalendarForCalendarYear
