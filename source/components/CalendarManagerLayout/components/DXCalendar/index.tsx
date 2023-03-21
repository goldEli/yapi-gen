import React from 'react'
import { StyledCalendar } from '../../styles'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import dayLocaleData from 'dayjs/plugin/localeData'

import { Calendar, Col, Radio, Row, Select, Typography, theme } from 'antd'
import styled from '@emotion/styled'

dayjs.extend(dayLocaleData)
const CalendarHeader = styled.div`
  width: 100%;
  height: 40px;
`

const DXCalendar: React.FC = () => {
  const wrapperStyle: React.CSSProperties = {
    width: 240,
    //  border: `1px solid ${token.colorBorderSecondary}`,
    //  borderRadius: token.borderRadiusLG,
  }
  return (
    <StyledCalendar
      style={wrapperStyle}
      fullscreen={false}
      onPanelChange={(value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode)
      }}
      headerRender={({ value, type, onChange, onTypeChange }) => {
        const month = value.month()
        console.log(month, 123)
        return (
          <CalendarHeader>
            <span
              onClick={() => {
                const now = value.clone().month(month - 1)
                onChange(now)
              }}
            >{`<`}</span>
            <span>{value.format('YYYY-MM')}</span>
            <span
              onClick={() => {
                const now = value.clone().month(month + 1)
                onChange(now)
              }}
            >{`>`}</span>
          </CalendarHeader>
        )
      }}
    />
  )
}

export default DXCalendar
