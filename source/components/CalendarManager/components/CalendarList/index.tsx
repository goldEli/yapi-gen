import React, { useEffect, useRef, useState } from 'react'

import { useDispatch, useSelector } from '@store/index'
import { getScheduleDaysOfList } from '@store/schedule/schedule.thunk'
import dayjs from 'dayjs'
import IconFont from '@/components/IconFont'
import { isDateIntersection } from '@/tools/index'
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
import { intersection } from 'lodash'
interface CalendarListProps {}

const CalendarList: React.FC<CalendarListProps> = props => {
  const CalendarListBoxRef = useRef<HTMLDivElement>(null)
  const { calenderListValue } = useSelector(state => state.calendarPanel)
  const { listViewScheduleList } = useSelector(state => state.schedule)
  const { checkedTime } = useSelector(state => state.calendar)
  const { checkedCalendarList } = useSelector(state => state.calendar)
  const checkedCalendarIdsRef = useRef<number[]>([])
  const disPatch = useDispatch()
  useEffect(() => {
    const params = {
      year: dayjs(calenderListValue).year(),
      month: dayjs(calenderListValue).month() + 1,
      calendar_ids: checkedCalendarList.map(
        (item: { calendar_id: number }) => item.calendar_id,
      ),
    }
    disPatch(getScheduleDaysOfList(params))
  }, [calenderListValue, checkedCalendarList])

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
    const calendar_ids = checkedCalendarList.map(
      (item: { calendar_id: number }) => item.calendar_id,
    )
    checkedCalendarIdsRef.current = calendar_ids
  }, [checkedCalendarList])
  // const isDateIntersection = (
  //   start1: string,
  //   end1: string,
  //   start2: string,
  //   end2: string,
  // ) => {
  //   const startdate1 = dayjs(start1).valueOf()
  //   const enddate1 = dayjs(end1).valueOf()

  //   const startdate2 = dayjs(start2).valueOf()
  //   const enddate2 = dayjs(end2).valueOf()

  //   if (startdate1 >= startdate2 && startdate1 <= enddate2) {
  //     //startdate1介于另一个区间之间
  //     return true
  //   }

  //   if (enddate1 >= startdate2 && enddate1 <= enddate2) {
  //     //enddate1介于另一个区间之间
  //     return true
  //   }

  //   if (startdate1 <= startdate1 && enddate1 >= enddate2) {
  //     //startdate1-enddate1的区间大于另一个区间，且另一个区间在startdate1-enddate1之间
  //     return true
  //   }

  //   return false
  // }
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
            {item.list.map((ele: any, idx: number) => (
              <TimeItem key={idx}>
                <span className={dateClass}>
                  {ele.is_all_day === 1
                    ? '全天'
                    : ele.start_time + '-' + ele.end_time}
                </span>
                <span>
                  {ele.subject}
                  {dayjs(ele.schedule_end_datetime).diff(
                    dayjs(ele.schedule_start_datetime),
                    'days',
                  ) +
                    1 >
                  1 ? (
                    <label>
                      （第{' '}
                      {dayjs(ele.end_datetime).diff(
                        dayjs(ele.schedule_start_datetime),
                        'days',
                      ) + 1}{' '}
                      天，共{' '}
                      {dayjs(ele.schedule_end_datetime).diff(
                        dayjs(ele.schedule_start_datetime),
                        'days',
                      ) + 1}{' '}
                      天）
                    </label>
                  ) : null}
                </span>
                {/* {(intersection(
                  [
                    item.list[idx]?.start_datetime,
                    item.list[idx]?.end_datetime,
                  ],
                  [
                    item.list[idx - 1]?.start_datetime,
                    item.list[idx - 1]?.end_datetime,
                  ],
                ).length ||
                  intersection(
                    [
                      item.list[idx + 1]?.start_datetime,
                      item.list[idx + 1]?.end_datetime,
                    ],
                    [
                      item.list[idx]?.start_datetime,
                      item.list[idx]?.end_datetime,
                    ],
                  ).length) &&
                item.list.length > 1 ? (
                  <span>
                    <IconFont type="warning-02"></IconFont>
                  </span>
                ) : null} */}

                {(isDateIntersection(
                  item.list[idx + 1]?.start_datetime,
                  item.list[idx + 1]?.end_datetime,
                  item.list[idx]?.start_datetime,
                  item.list[idx]?.end_datetime,
                ) ||
                  isDateIntersection(
                    item.list[idx]?.start_datetime,
                    item.list[idx]?.end_datetime,
                    item.list[idx - 1]?.start_datetime,
                    item.list[idx - 1]?.end_datetime,
                  )) &&
                item.list.length > 1 ? (
                  <span>
                    <IconFont type="warning-02"></IconFont>
                  </span>
                ) : null}
              </TimeItem>
            ))}
          </CalendarListInfo>
        </CalendarListItem>
      ))}
    </CalendarListBox>
  )
}

export default CalendarList
