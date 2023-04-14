import React, { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { useDispatch, useSelector } from '@store/index'
import {
  getScheduleDaysOfList,
  getScheduleSearch,
} from '@store/schedule/schedule.thunk'
import dayjs from 'dayjs'
interface CalendarListProps {}
const CalendarListBox = styled.div`
  background-color: #fff;
  max-height: 600px;
  overflow-y: scroll;
`
const CalendarListItem = styled.div`
  border-top: 1px solid var(--neutral-n6-d1);
  display: flex;
  padding: 12px 0px;
  align-items: flex-start;
`
const DateBox = styled.div`
  color: var(--neutral-n1-d1);
  font-size: var(--font18);
  font-weight: 500;
  width: 40px;
`
const MonthWeekBox = styled.div`
  color: var(--neutral-n1-d1);
  font-size: var(--font16);
`
// 农历日期组件
const LunarDate = styled.div`
  color: var(--neutral-n3);
  font-size: var(--font12);
  margin-left: 4px;
`
const CalendarListInfo = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  top: 6px;
`
const TimeItem = styled.div`
  color: var(--neutral-n1-d1);
  font-size: var(--font14);
  margin-left: 115px;
  position: relative;
  margin-bottom: 8px;
  &:before {
    position: absolute;
    content: '';
    left: -12px;
    top: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--primary-d1);
  }
`
const CalendarListClass = css`
  :last-child {
    border-bottom: 1px solid var(--neutral-n6-d1);
  }
`
const dateClass = css`
  margin-right: 65px;
  display: inline-block;
  width: 100px;
`
const currentClass = css`
  background: var(--primary-d1) !important;
  border-radius: 50% !important;
  color: #fff !important;
  font-size: var(--font18) !important;
  text-align: center !important;
  display: inline-block;
  width: 28px !important;
  height: 28px !important;
`
const CalendarList: React.FC<CalendarListProps> = props => {
  const CalendarListBoxRef = useRef<HTMLDivElement>(null)
  const { calenderListValue } = useSelector(state => state.calendarPanel)
  const { scheduleSearchKey } = useSelector(state => state.calendarPanel)
  const { calendarData } = useSelector(state => state.calendar)
  const { listViewScheduleList = [] } = useSelector(state => state.schedule)
  const { checkedTime } = useSelector(state => state.calendar)
  let data1 = calendarData?.manager.concat(calendarData?.subscribe)
  const disPatch = useDispatch()
  useEffect(() => {
    console.log('列表视图')
    let params = {
      year: dayjs(calenderListValue).year(),
      month: dayjs(calenderListValue).month() + 1,
      calendar_ids: data1.map(item => item.calendar_id),
    }
    disPatch(getScheduleDaysOfList(params))
  }, [calenderListValue])
  useEffect(() => {
    let params = {
      year: dayjs(calenderListValue).year(),
      keyword: scheduleSearchKey || '',
      calendar_ids: data1.map(item => item.calendar_id),
    }
    disPatch(getScheduleSearch(params))
  }, [scheduleSearchKey])
  useEffect(() => {
    let childrenKeys = [...(CalendarListBoxRef.current?.children as any)].map(
      item => {
        return {
          type: item.getAttribute('datatype'),
          height: item.clientHeight,
        }
      },
    )
    let currentItem = childrenKeys.find(item => item.type === checkedTime)
    let currentIndex = childrenKeys.findIndex(item => item.type === checkedTime)
    let totalHeight = 0
    for (let i = 0; i < childrenKeys.length; i++) {
      totalHeight += childrenKeys[i].height
      if (i === currentIndex || !currentItem) {
        break
      }
    }
    console.log('currentItem', currentItem, currentIndex, totalHeight)
    if (CalendarListBoxRef.current) {
      CalendarListBoxRef.current.scrollTo({
        top: totalHeight,
        behavior: 'smooth',
      })
    }
  }, [checkedTime])
  return (
    <CalendarListBox ref={CalendarListBoxRef}>
      {listViewScheduleList.map((item: any, index: number) => (
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
            {item.list.map((ele: any) => (
              <TimeItem key={ele.schedule_id}>
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
