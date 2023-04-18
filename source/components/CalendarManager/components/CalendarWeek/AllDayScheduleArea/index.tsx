import React, { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import DayItem from './DayItem'
import ScheduleInfoDropdown from '../../ScheduleInfoDropdown'
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
  display: flex;
  /* display: grid; */
  /* grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr; */
  position: relative;
  /* height: 100px; */
`

const Content: React.FC<ContentProps> = props => {
  const { scheduleList } = useSelector(store => store.schedule)
  const { selectedWeek } = useSelector(store => store.calendar)
  const { quickCreateScheduleModel, scheduleInfoDropdown } = useSelector(
    store => store.calendarPanel,
  )
  const { list } = useScheduleListSort(scheduleList)

  const isShowScheduleDetailModal = React.useMemo(() => {
    for (const key in scheduleList) {
      const list = scheduleList[key]
      const cur = list.find(
        item => item.schedule_id === scheduleInfoDropdown.schedule_id,
      )
      if (cur?.is_all_day === 1 || cur?.is_span_day) {
        return true
      }
    }
    return false
  }, [scheduleList, scheduleInfoDropdown])

  const content = useMemo(() => {
    const arr = Array(7).fill(0)
    return arr.map((_, idx) => {
      const info = selectedWeek?.[idx]
      return <DayItem idx={idx} key={idx} list={list[info?.date ?? '']} />
    })
  }, [selectedWeek, list])

  return (
    <ContentBox className="calendar-week-all-day-box">
      {content}
      {isShowScheduleDetailModal && (
        <ScheduleInfoDropdown containerClassName=".calendar-week-all-day-box" />
      )}
      {quickCreateScheduleModel.isAll && (
        <QuickCreateScheduleModel containerClassName=".calendar-week-all-day-box" />
      )}
      <ScheduleListModal />
    </ContentBox>
  )
}

export default Content
