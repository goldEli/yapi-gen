import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import DayItem from './DayItem'
import QuickCreateScheduleModel from '../../QuickCreateScheduleModel'
import { useSelector } from '@store/index'
import dayjs from 'dayjs'
import { sortScheduleList } from '@/components/CalendarManager/utils'
import { formatYYYYMMDD } from '@/components/CalendarManager/config'
import ScheduleListModal from '../../ScheduleListModal'
import useScheduleListSort from '@/components/CalendarManager/hooks/useScheduleListSort'

interface ContentProps {}

const ContentBox = styled.div`
  width: 100%;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 150px 150px 150px 150px 150px 150px;
  position: relative;
`

const Content: React.FC<ContentProps> = props => {
  const { scheduleList } = useSelector(store => store.schedule)
  const { selectedMonth } = useSelector(store => store.calendar)
  const { list } = useScheduleListSort(scheduleList)

  return (
    <ContentBox className="calendar-month-content-box">
      {Array(42)
        .fill(0)
        .map((_, idx) => {
          const info = selectedMonth?.[idx]
          return <DayItem idx={idx} key={idx} list={list[info?.date ?? '']} />
        })}
      {/* <QuickCreateScheduleModel containerClassName=".calendar-month-content-box" /> */}
      <ScheduleListModal />
    </ContentBox>
  )
}

export default Content
