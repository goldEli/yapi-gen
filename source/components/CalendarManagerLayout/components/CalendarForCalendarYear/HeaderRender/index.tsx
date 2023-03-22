import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React from 'react'

interface HeaderRenderProps {
  onChange(date: dayjs.Dayjs): void
  month: number
}

const CalendarHeader = styled.div`
  width: 100%;
  height: 40px;
`

const HeaderRender: React.FC<HeaderRenderProps> = props => {
  return <CalendarHeader>{`${props.month}月`}</CalendarHeader>
}

export default HeaderRender
