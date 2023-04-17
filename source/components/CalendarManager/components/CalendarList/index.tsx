import React, { useEffect, useRef, useState } from 'react'

import { useDispatch, useSelector } from '@store/index'
import {
  getScheduleDaysOfList,
  getScheduleSearch,
} from '@store/schedule/schedule.thunk'
import dayjs from 'dayjs'
import {
  CalendarListBox,
  CalendarListItem,
  DateBox,
  MonthWeekBox,
  LunarDate,
  CalendarListInfo,
  TimeItem,
  CalendarListClass,
  dateClass,
  currentClass,
} from './styles'
interface CalendarListProps {}

const CalendarList: React.FC<CalendarListProps> = props => {
  const CalendarListBoxRef = useRef<HTMLDivElement>(null)
  const { calenderListValue } = useSelector(state => state.calendarPanel)
  const { scheduleSearchKey } = useSelector(state => state.calendarPanel)
  const { listViewScheduleList } = useSelector(state => state.schedule)
  const { checkedTime } = useSelector(state => state.calendar)
  const { checkedCalendarList } = useSelector(state => state.calendar)
  const [checkedCalendarIds, setCheckedCalendarIds] = useState(
    checkedCalendarList.map(item => item.calendar_id),
  )
  const checkedCalendarIdsRef = useRef<number[]>([])
  // const calendarDataArray = calendarData?.manager.concat(
  //   calendarData?.subscribe,
  // )
  const disPatch = useDispatch()
  const getSearchList = () => {
    disPatch(
      getScheduleSearch({
        year: dayjs(calenderListValue).year(),
        keyword: scheduleSearchKey,
        calendar_ids: checkedCalendarIdsRef.current,
      }),
    )
  }
  useEffect(() => {
    const params = {
      year: dayjs(calenderListValue).year(),
      month: dayjs(calenderListValue).month() + 1,
      calendar_ids: checkedCalendarList.map(item => item.calendar_id),
    }
    disPatch(getScheduleDaysOfList(params))
  }, [calenderListValue])

  useEffect(() => {
    const childrenKeys = [...(CalendarListBoxRef.current?.children as any)].map(
      item => {
        return {
          type: item.getAttribute('datatype'),
          height: item.clientHeight,
        }
      },
    )
    const currentItem = childrenKeys.find(item => item.type === checkedTime)
    const currentIndex = childrenKeys.findIndex(
      item => item.type === checkedTime,
    )
    let totalHeight = 0
    for (let i = 0; i < childrenKeys.length; i++) {
      totalHeight += childrenKeys[i].height
      if (i === currentIndex || !currentItem) {
        break
      }
    }

    if (CalendarListBoxRef.current) {
      CalendarListBoxRef.current.scrollTo({
        top: totalHeight,
        behavior: 'smooth',
      })
    }
  }, [checkedTime])
  useEffect(() => {
    const calendar_ids = checkedCalendarList.map(item => item.calendar_id)
    checkedCalendarIdsRef.current = calendar_ids
    setCheckedCalendarIds([...calendar_ids])
    getSearchList()
  }, [checkedCalendarList, scheduleSearchKey])
  return (
    <CalendarListBox ref={CalendarListBoxRef}>
      {listViewScheduleList?.map((item: any, index: number) => (
        <CalendarListItem
          key={index}
          className={CalendarListClass}
          datatype={item.date}
        >
          <div style={{ width: '40px' }}>
            <DateBox className={index === 0 ? currentClass : ''}>
              {dayjs(item.date).date()}
            </DateBox>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MonthWeekBox>
              {item.list[0].month}月 {item.list[0].week_name}
            </MonthWeekBox>
            <LunarDate>{item.list[0].lunar_day_chinese} </LunarDate>
          </div>
          <CalendarListInfo>
            {item.list.map((ele: any, index: number) => (
              <TimeItem key={index}>
                <span className={dateClass}>{ele.date}</span>
                <span>{ele.subject}</span>
              </TimeItem>
            ))}
          </CalendarListInfo>
        </CalendarListItem>
      ))}
    </CalendarListBox>
  )
}

export default CalendarList
