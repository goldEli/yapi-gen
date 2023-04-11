import React, { useEffect, useState } from 'react'
import { StyledCalendar } from '../../styles'

import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/zh-cn'
import dayLocaleData from 'dayjs/plugin/localeData'
import styled from '@emotion/styled'
import HeaderRender from './HeaderRender'
import { css } from '@emotion/css'
import { setScheduleListModal, setScheduleDate } from '@store/schedule'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import { useDispatch, useSelector } from '@store/index'
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
  background: var(--primary-d1);
  color: var(--neutral-white-d7);
  position: relative;
`
const hasScheduleClass = css`
  position: relative;
  &::after {
    position: absolute;
    content: '';
    width: 6px;
    height: 6px;
    background: var(--primary-d1);
    bottom: -8px;
    left: 10px;
    border-radius: 50%;
  }
`
interface CalendarForCalendarYearProps {
  month: number
}
const wrapperStyle: React.CSSProperties = {
  width: 240,
}

const CalendarForCalendarYear: React.FC<
  CalendarForCalendarYearProps
> = props => {
  //const current = React.useMemo(() => dayjs().month(props.month), [props.month])
  const { yearViewScheduleList } = useSelector(state => state.schedule)
  console.log('yearViewScheduleList', yearViewScheduleList)
  const [date, setDate] = useState<Dayjs>(dayjs())
  const onCallBack = (date: Dayjs) => {
    setDate(date)
  }
  const disPatch = useDispatch()
  return (
    <div style={{ position: 'relative' }}>
      <StyledCalendar
        dateFullCellRender={date => {
          const today =
            dayjs().format('DD/MM/YYYY') === dayjs(date).format('DD/MM/YYYY')
          const hasSchedule = [
            '21/03/2023',
            '18/02/2023',
            '16/02/2023',
          ].includes(dayjs(date).format('DD/MM/YYYY'))
          return (
            <DayBox
              className={
                today ? dayActive : hasSchedule ? hasScheduleClass : ''
              }
              onClick={e => {
                let month = props.month
                e.stopPropagation()
                // setScheduleDate
                disPatch(
                  setScheduleListModal({
                    visible: true,
                    top: 76,
                    left: 100,
                    date: dayjs(date).date(),
                  }),
                )
                disPatch(setScheduleDate(month))
                disPatch(setScheduleInfoDropdown({ visible: false }))
              }}
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
