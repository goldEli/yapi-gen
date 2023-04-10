import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { useSelector } from '@store/index'
import dayjs from 'dayjs'
interface CalendarListProps {}
const CalendarListBox = styled.div`
  background-color: #fff;
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
    },
    { id: 2, list: [{ text: '这是一个日程标题内容', date: '09-10' }] },
    { id: 3, list: [{ text: '这是一个日程标题内容', date: '09-10' }] },
    { id: 2, list: [{ text: '这是一个日程标题内容', date: '09-10' }] },
    { id: 3, list: [{ text: '这是一个日程标题内容', date: '09-10' }] },
    { id: 2, list: [{ text: '这是一个日程标题内容', date: '09-10' }] },
    { id: 3, list: [{ text: '这是一个日程标题内容', date: '09-10' }] },
    { id: 2, list: [{ text: '这是一个日程标题内容', date: '09-10' }] },
    { id: 3, list: [{ text: '这是一个日程标题内容', date: '09-10' }] },
    { id: 2, list: [{ text: '这是一个日程标题内容', date: '09-10' }] },
    { id: 3, list: [{ text: '这是一个日程标题内容', date: '09-10' }] },
  ]
  const canendarListValue = useSelector(
    state => state.calendarPanel.calenderListValue,
  )
  useEffect(() => {
    console.log(11, canendarListValue, dayjs(canendarListValue).valueOf())
  }, [canendarListValue])
  return (
    <CalendarListBox>
      {data.map((item, index) => (
        <CalendarListItem key={index} className={CalendarListClass}>
          <div style={{ width: '40px' }}>
            <DateBox className={index === 0 ? currentClass : ''}>
              {18 + index}
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
      ))}
    </CalendarListBox>
  )
}

export default CalendarList
