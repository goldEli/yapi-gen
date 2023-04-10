import styled from '@emotion/styled'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import { useDispatch, useSelector } from '@store/index'
import React from 'react'
import { hexToRgba } from '../utils'
import useScheduleListBySelectedDay from '@/components/CalendarManager/hooks/useScheduleListBySelectedDay'
import { getColorWithOpacityPointOne } from '@/components/CalendarManager/utils'
import useScheduleAllDayList from '../hooks/useScheduleAllDayList'
import { AllDayScheduleItem } from '@/components/CalendarManager/styles'

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

const ScheduleAllDay: React.FC<ScheduleAllDayProps> = props => {
  const { list } = useScheduleAllDayList()
  const dispatch = useDispatch()
  return (
    <ScheduleAllDayBox>
      <TimeZone>GTM+08</TimeZone>
      <Day>16</Day>
      <Month>3月</Month>
      <Week>周四</Week>
      <Lunar>二十一</Lunar>
      <ScheduleList>
        <ScheduleListScroll>
          {list?.map(item => {
            return (
              <AllDayScheduleItem
                onClick={() => {
                  dispatch(
                    setScheduleInfoDropdown({
                      visible: true,
                      y: 0,
                      x: 300,
                    }),
                  )
                }}
                key={item.schedule_id}
                bg={getColorWithOpacityPointOne(item.color)}
              >
                {item.subject}
              </AllDayScheduleItem>
            )
          })}
        </ScheduleListScroll>
      </ScheduleList>
    </ScheduleAllDayBox>
  )
}

export default ScheduleAllDay
