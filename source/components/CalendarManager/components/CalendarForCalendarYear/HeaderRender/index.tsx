import styled from '@emotion/styled'
import dayjs, { Dayjs } from 'dayjs'
import React, { useState, useEffect } from 'react'
import { useSelector } from '@store/index'
import ScheduleListModal from '../../ScheduleListModal'
import { useTranslation } from 'react-i18next'
interface HeaderRenderProps {
  onChange(date: dayjs.Dayjs): void
  month: number
  value: Dayjs
  onCallBack(data: Dayjs): void
}

const CalendarHeader = styled.div`
  width: 100%;
  height: 40px;
  position: relative;
  font-family: SiYuanMedium;
`
const HeaderRender: React.FC<HeaderRenderProps> = props => {
  const [t] = useTranslation()
  const calenderTypeValue = useSelector(
    state => state.calendarPanel.calenderTypeValue,
  )
  const scheduleInfo = useSelector(
    state => state.calendarPanel.scheduleInfoDropdown,
  )
  const date = useSelector(state => state.schedule.scheduleDate)

  useEffect(() => {
    let year = dayjs(calenderTypeValue)
    props.onCallBack(year)
    props.onChange(year)
  }, [calenderTypeValue])
  return (
    <CalendarHeader>
      {`${props.month + 1}${t('moon')}`}
      {props.month === date ? <ScheduleListModal /> : null}
    </CalendarHeader>
  )
}

export default HeaderRender
