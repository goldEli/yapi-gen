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

type List = {
  [key in string]: (Model.Schedule.Info | undefined)[]
}

const Content: React.FC<ContentProps> = props => {
  const { scheduleList } = useSelector(store => store.schedule)
  const { selectedWeek } = useSelector(store => store.calendar)
  const { quickCreateScheduleModel, scheduleInfoDropdown } = useSelector(
    store => store.calendarPanel,
  )
  const [list, setList] = useState<List>({})

  useEffect(() => {
    if (!scheduleList) {
      return
    }
    // sort
    const o: List = {}
    for (const key in scheduleList) {
      o[key] = sortScheduleList(scheduleList[key])
    }
    // const res:any = {}

    for (const key in o) {
      const list = o[key]
      const res: (Model.Schedule.Info | undefined)[] = Array(3).fill(void 0)
      for (let i = 0; i < 3; ++i) {
        const item = list[i]
        if (
          item?.is_span_day &&
          !dayjs(item.start_datetime).isSame(
            dayjs(item.schedule_start_datetime),
            'day',
          )
        ) {
          const theDayBefore = dayjs(key).add(-1, 'day').format(formatYYYYMMDD)
          const theDayBeforeScheduleList = o[theDayBefore]
          const index = theDayBeforeScheduleList?.findIndex(
            schedule => schedule?.schedule_id === item.schedule_id,
          )
          res[index] = item
        }
        if (res.every(r => r === void 0)) {
          o[key] = list
        } else {
          const filtered = list.filter(
            l => !res.some(r => r?.schedule_id === l?.schedule_id),
          )
          let idx = 0
          for (let j = 0; j < 3; ++j) {
            if (res[j] === void 0) {
              res[j] = filtered[idx]
              ++idx
            }
          }
          o[key] = res
        }
      }
    }
    setList(o)
    // console.log(res)
  }, [scheduleList])

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
