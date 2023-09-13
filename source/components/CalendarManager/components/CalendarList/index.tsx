import React, { useEffect, useRef, useState, useMemo } from 'react'

import { useDispatch, useSelector } from '@store/index'
import { getScheduleDaysOfList } from '@store/schedule/schedule.thunk'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import IconFont from '@/components/IconFont'
import { isDateIntersection } from '@/tools/index'
import { getColorWithOpacityPointOne, getColor } from '../../utils'
import { Popover, Tooltip } from 'antd'
import {
  setScheduleInfoDropdown,
  setInitScheduleInfoDropdown,
} from '@store/calendarPanle'
import { setScheduleInfo } from '@store/schedule'
import NoData from '@/components/NoData'
import {
  CalendarListBox,
  CalendarListItem,
  DateBox,
  MonthWeekBox,
  LunarDate,
  CalendarListInfo,
  TimeItem,
  Dot,
  CalendarListClass,
  dateClass,
  currentClass,
} from './styles'
import { formatYYYYMMDD } from '../../config'
interface CalendarListProps {}
const CalendarList: React.FC<CalendarListProps> = props => {
  const CalendarListBoxRef = useRef<HTMLDivElement>(null)
  const { calenderTypeValue, calendarLoading } = useSelector(
    state => state.calendarPanel,
  )
  const { listViewScheduleList } = useSelector(state => state.schedule)
  const { checkedTime } = useSelector(state => state.calendar)
  const { checkedCalendarList } = useSelector(state => state.calendar)
  const checkedCalendarIdsRef = useRef<number[]>([])
  let paramsRef = useRef<any>()
  const { calendarConfig } = useSelector(state => state.calendar)
  const { view_options } = calendarConfig

  const disPatch = useDispatch()
  const [t] = useTranslation()
  useEffect(() => {
    const params = {
      has_other_month: 0,
      year: dayjs(calenderTypeValue).year(),
      month: dayjs(calenderTypeValue).month() + 1,
      calendar_ids: checkedCalendarList.map(
        (item: { calendar_id: number }) => item.calendar_id,
      ),
    }
    if (paramsRef.current === dayjs(calenderTypeValue).format('YYYY-MM')) {
      return
    }
    disPatch(getScheduleDaysOfList(params))
    paramsRef.current = dayjs(calenderTypeValue).format('YYYY-MM')
  }, [calenderTypeValue, checkedCalendarList])

  useEffect(() => {
    if (!CalendarListBoxRef.current) return
    const childrenKeys = [...CalendarListBoxRef.current?.children].map(item => {
      return {
        type: item.getAttribute('datatype'),
        height: item.clientHeight,
      }
    })
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
  return (
    <>
      {listViewScheduleList?.length !== 0 && (
        <CalendarListBox ref={CalendarListBoxRef}>
          {listViewScheduleList?.map((item: any, index: number) => (
            <CalendarListItem
              key={index}
              className={CalendarListClass}
              datatype={item.date}
            >
              <div>
                <DateBox
                  className={
                    dayjs(checkedTime).format('DD') ===
                    dayjs(item.date).format('DD')
                      ? currentClass
                      : ''
                  }
                >
                  {dayjs(item.date).date()}
                </DateBox>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <MonthWeekBox>
                  {item.list[0].month}月 {item.list[0].week_name}
                </MonthWeekBox>
                {view_options?.show_lunar_calendar === 1 && (
                  <LunarDate>{item.list[0].lunar_day_chinese} </LunarDate>
                )}
              </div>
              <CalendarListInfo>
                {item.list.map((ele: any, idx: number) => (
                  <TimeItem
                    key={idx}
                    color={getColorWithOpacityPointOne(ele.color)}
                    onClick={() => {
                      disPatch(setInitScheduleInfoDropdown({ schedule_id: 0 }))
                      setTimeout(() => {
                        disPatch(
                          setScheduleInfoDropdown({
                            visible: true,
                            schedule_id: ele.schedule_id,
                            show_date: dayjs(ele.date).format(formatYYYYMMDD),
                          }),
                        )
                      }, 0)

                      disPatch(setScheduleInfo(void 0))
                    }}
                  >
                    <Dot color={getColor(ele.color)}></Dot>
                    <span className={dateClass}>
                      {ele.is_all_day === 1
                        ? t('calendarManager.allDay')
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
                          {t('calendarManager.dayof', {
                            day:
                              dayjs(ele.end_datetime).diff(
                                dayjs(ele.schedule_start_datetime),
                                'days',
                              ) + 1,
                            days:
                              dayjs(ele.schedule_end_datetime).diff(
                                dayjs(ele.schedule_start_datetime),
                                'days',
                              ) + 1,
                          })}
                        </label>
                      ) : null}
                    </span>
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
                      <Tooltip
                        placement="top"
                        title={t('calendarManager.conflict')}
                      >
                        <span>
                          <IconFont type="warning-02"></IconFont>
                        </span>
                      </Tooltip>
                    ) : null}
                  </TimeItem>
                ))}
              </CalendarListInfo>
            </CalendarListItem>
          ))}
        </CalendarListBox>
      )}

      {listViewScheduleList?.length === 0 && calendarLoading === false && (
        <NoData subText={t('calendarManager.noSchedule')}></NoData>
      )}
    </>
  )
}

export default CalendarList
