import React from 'react'
import { StyledCalendar } from '../../styles'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import dayLocaleData from 'dayjs/plugin/localeData'
import styled from '@emotion/styled'
import HeaderRender from './HeaderRender'
import { css } from '@emotion/css'

dayjs.extend(dayLocaleData)

const DayBox = styled.div`
  width: 24px;
  height: 24px;
  font-size: 14px;
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
  month: number
}
const wrapperStyle: React.CSSProperties = {
  width: 240,
  //  border: `1px solid ${token.colorBorderSecondary}`,
  //  borderRadius: token.borderRadiusLG,
}

const CalendarForCalendarYear: React.FC<
  CalendarForCalendarYearProps
> = props => {
  const current = React.useMemo(() => dayjs().month(props.month), [props.month])

  return (
    <StyledCalendar
      dateFullCellRender={date => {
        const today =
          dayjs().format('DD/MM/YYYY') === dayjs(date).format('DD/MM/YYYY')
        return (
          <DayBox className={today ? dayActive : ''}>
            {dayjs(date).date()}
          </DayBox>
        )
      }}
      value={current}
      style={wrapperStyle}
      fullscreen={false}
      onPanelChange={(value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode)
      }}
      headerRender={({ value, type, onChange, onTypeChange }) => {
        return <HeaderRender month={props.month} onChange={onChange} />
      }}
    />
  )
}

export default CalendarForCalendarYear
