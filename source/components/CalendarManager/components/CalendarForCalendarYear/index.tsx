import React, { useEffect, useState } from 'react'
import { StyledCalendar } from '../../styles'

import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/zh-cn'
import dayLocaleData from 'dayjs/plugin/localeData'
import styled from '@emotion/styled'
import HeaderRender from './HeaderRender'
import { css } from '@emotion/css'
import { setScheduleListMoadl, setScheduleDate } from '@store/schedule'
import {setScheduleInfoDropdown} from '@store/calendarPanle'
import { useDispatch, useSelector } from '@store/index'
import ScheduListModal from '../ScheduleList'
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
`
interface CalendarForCalendarYearProps {
  month: number,
}
const wrapperStyle: React.CSSProperties = {
  width: 240,
}

const CalendarForCalendarYear: React.FC<
  CalendarForCalendarYearProps
> = props => {
  //const current = React.useMemo(() => dayjs().month(props.month), [props.month])
  const [date, setDate] = useState<Dayjs>(dayjs())
  const onCallBack = (date: Dayjs) => {
    setDate(date)
  }
  const dateClick = (e:any) => {
    let month=props.month;
    console.log(1111111)
    e.stopPropagation()
    disPatch(setScheduleListMoadl({ visible: true, top: 76, left: 100 }))// setScheduleDate
    disPatch(setScheduleDate(month))
    disPatch(setScheduleInfoDropdown({visible:false}));
  }
  const disPatch = useDispatch()
  return (
    <div style={{ position: 'relative' }}>
      <StyledCalendar
        dateFullCellRender={date => {
          const today = dayjs().format('DD/MM/YYYY') === dayjs(date).format('DD/MM/YYYY');
          return (
            <DayBox className={today ? dayActive : ''} onClick={dateClick}>
              {dayjs(date).date()}
            </DayBox>
          )
        }}
        value={date.month(props.month)}
        style={wrapperStyle}
        fullscreen={false}
        onPanelChange={(value, mode) => {
        }}

        headerRender={({ value, type, onChange, onTypeChange }) => {
          return <HeaderRender  month={props.month} value={value} onChange={onChange} onCallBack={onCallBack} />
        }}
      />

    </div>
  )
}

export default CalendarForCalendarYear