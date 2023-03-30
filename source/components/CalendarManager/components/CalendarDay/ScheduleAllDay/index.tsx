import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import React from 'react'
import { hexToRgba } from '../utils'

interface ScheduleAllDayProps {}
const ScheduleAllDayBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 16px;
  box-sizing: border-box;
  overflow: hidden;
  height: 52px;
  position: absolute;
  top: -55px;
  left: 0;
`

const TimeZone = styled.span`
  font-size: 14px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: var(--neutral-n1-d1);
`
const Day = styled.span`
  width: 28px;
  height: 28px;
  background: var(--primary-d1);
  font-size: 18px;
  font-weight: 500;
  color: var(--neutral-white-d7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`
const Month = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: var(--neutral-n1-d2);
`
const Week = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: var(--neutral-n1-d2);
`
const Lunar = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n3);
`
const ScheduleList = styled.div`
  flex: 1;
  height: 100%;
  overflow: hidden;
`

const ScheduleListScroll = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  gap: 2px;
  overflow-y: scroll;
`

const ScheduleItem = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding-left: 8px;
  background-color: ${(props: { bg: string }) => props.bg};
  font-size: 12px;
  font-weight: 400;
  color: var(--neutral-n1-d1);
  display: flex;
  align-items: center;
  height: 20px;
`

const ScheduleAllDay: React.FC<ScheduleAllDayProps> = props => {
  const scheduleList = useSelector(store => store.schedule.scheduleList)
  const list = React.useMemo(
    () => scheduleList.filter(item => item.is_all_day === 1),
    [scheduleList],
  )
  return (
    <ScheduleAllDayBox>
      <TimeZone>GTM+08</TimeZone>
      <Day>16</Day>
      <Month>3月</Month>
      <Week>周四</Week>
      <Lunar>二十一</Lunar>
      <ScheduleList>
        <ScheduleListScroll>
          {list.map(item => {
            return (
              <ScheduleItem key={item.id} bg={hexToRgba(item.color, 0.1)}>
                {item.title}
              </ScheduleItem>
            )
          })}
        </ScheduleListScroll>
      </ScheduleList>
    </ScheduleAllDayBox>
  )
}

export default ScheduleAllDay
