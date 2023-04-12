import React, { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { useDispatch, useSelector } from '@store/index'
import { getCalendarDaysOfMonthList } from '@store/schedule/schedule.thunk'
import dayjs from 'dayjs'
interface CalendarListProps { }
const CalendarListBox = styled.div`
  background-color: #fff;
  max-height: 500px;
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
  align-items: center;
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
  const data = [
    {
      id: 1,
      list: [
        { text: '这是一个日程标题内容', date: '全天' },
        { text: '这是一个日程标题内容', date: '09-10' },
        { text: '这是一个日程标题内容', date: '11-12' },
      ],
      time: '2023-04-18'
    },
    { id: 2, time: '2023-04-19', list: [{ text: '这是一个日程标题内容', date: '2023-04-18' }] },
    { id: 3, time: '2023-04-20', list: [{ text: '这是一个日程标题内容', date: '2023-04-19' }] },
    { id: 2, time: '2023-04-21', list: [{ text: '这是一个日程标题内容', date: '2023-04-20' }] },
    { id: 3, time: '2023-04-22', list: [{ text: '这是一个日程标题内容', date: '2023-04-21' }] },
    { id: 2, time: '2023-04-23', list: [{ text: '这是一个日程标题内容', date: '2023-04-22' }] },
    { id: 3, time: '2023-04-24', list: [{ text: '这是一个日程标题内容', date: '2023-04-23' }] },
    { id: 2, time: '2023-04-25', list: [{ text: '这是一个日程标题内容', date: '2023-04-24' }] },
    { id: 3, time: '2023-04-16', list: [{ text: '这是一个日程标题内容', date: '2023-04-15' }] },
    { id: 2, time: '2023-04-15', list: [{ text: '这是一个日程标题内容', date: '2023-04-16' }] },
  ]
  const CalendarListBoxRef = useRef<HTMLDivElement>(null)
  const { calenderListValue } = useSelector(state => state.calendarPanel);
  const { scheduleSearchKey } = useSelector(state => state.calendarPanel);
  const { calendarData } = useSelector(state => state.calendar);
  const { monthViewScheduleList } = useSelector(state => state.schedule);
  const { checkedTime } = useSelector(state => state.calendar)
  console.log('monthViewScheduleList---', monthViewScheduleList, calenderListValue)
  let data1 = calendarData?.manager.concat(calendarData?.subscribe);
  const disPatch = useDispatch()
  useEffect(() => {
    console.log('列表视图', calenderListValue, CalendarListBoxRef, checkedTime)
    let params = {
      year:dayjs(calenderListValue).year(),
      month: dayjs(calenderListValue).month(),
      calendar_ids: data1.map(item => item.calendar_id)
    }
    disPatch(getCalendarDaysOfMonthList(params))
  }, [calenderListValue, scheduleSearchKey])
  useEffect(() => {
    let childrenKeys = [...CalendarListBoxRef.current?.children as any].map((item => item.getAttribute('datatype')));
    let index=childrenKeys.indexOf(checkedTime);
    if (CalendarListBoxRef.current) {
      CalendarListBoxRef.current.scrollTo({
        top: 60*index,
        behavior: 'smooth'
      })
    }
  }, [checkedTime])
  return <CalendarListBox ref={CalendarListBoxRef}>
    {
      data.map((item, index) =>
        <CalendarListItem key={index} className={CalendarListClass} datatype={item.time}>
          <div style={{ width: '40px' }}>
            <DateBox className={index === 0 ? currentClass : ''}>
              {dayjs().date()+index }
            </DateBox>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MonthWeekBox>3月 周日</MonthWeekBox>
            <LunarDate>廿四 </LunarDate>
          </div>
          <CalendarListInfo>
            {item.list.map((ele, idx) => (
              <TimeItem key={ele.date}>
                <span className={dateClass}>{ele.date}</span>
                <span>{ele.text}</span>
              </TimeItem>
            ))}
          </CalendarListInfo>
        </CalendarListItem>
      )}
  </CalendarListBox>
}

export default CalendarList
