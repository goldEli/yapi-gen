import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import DayItem from './DayItem'
import { useSelector } from '@store/index'
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

  const filteredScheduleList = useMemo(() => {
    const res: API.Schedule.ScheduleListResult = {}
    for (const key in scheduleList) {
      res[key] = scheduleList[key].filter(
        item => item.is_all_day === 1 || item.is_span_day,
      )
    }
    return res
  }, [scheduleList])
  const { list } = useScheduleListSort(filteredScheduleList)

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
      {/* {quickCreateScheduleModel.isAll && (
        <QuickCreateScheduleModel containerClassName=".calendar-week-all-day-box" />
      )} */}
      <ScheduleListModal />
    </ContentBox>
  )
}

export default Content
