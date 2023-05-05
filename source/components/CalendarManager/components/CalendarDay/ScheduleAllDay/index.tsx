import styled from '@emotion/styled'
import {
  setQuickCreateScheduleModel,
  setScheduleInfoDropdown,
} from '@store/calendarPanle'
import { setIsAddOrDelete } from '@store/schedule'
import { useDispatch, useSelector } from '@store/index'
import React, { useEffect, useMemo, useState } from 'react'
import useScheduleAllDayList from '../hooks/useScheduleAllDayList'
import { AllDayScheduleItem } from '@/components/CalendarManager/styles'
import dayjs from 'dayjs'
import { getDaysOfWeekList } from '@/services/calendar'
import useColor from '@/components/CalendarManager/hooks/useColor'
import useShowLunar from '@/components/CalendarManager/hooks/useShowLunar'
import {
  getColor,
  getColorWithOpacityPointOne,
} from '@/components/CalendarManager/utils'
import { Dot, Time, Title } from '../../ScheduleStrip/styled'
import ScheduleStripContent from '../../ScheduleStrip/ScheduleStripContent'

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
  position: sticky;
  top: 70px;
  left: 0px;
  background: var(--neutral-white-d1);
  z-index: 100;
`

const TimeZone = styled.span`
  font-size: 14px;
  font-family: SiYuanMedium;
  color: var(--neutral-n1-d1);
`
const Day = styled.span`
  width: 28px;
  height: 28px;
  background: var(--primary-d1);
  font-size: 18px;
  font-family: SiYuanMedium;
  color: var(--neutral-white-d7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`
const Month = styled.span`
  font-size: 16px;

  color: var(--neutral-n1-d2);
`
const Week = styled.span`
  font-size: 16px;

  color: var(--neutral-n1-d2);
`
const Lunar = styled.span`
  font-size: 14px;

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
  const { calenderTypeValue } = useSelector(store => store.calendarPanel)
  const { checkedTime } = useSelector(state => state.calendar)
  const [weekDay, setWeekDay] = useState<Model.Calendar.DaysOfWeek>()
  const { getColorClassName } = useColor()
  const { showLunar } = useShowLunar()

  const time = useMemo(() => {
    return dayjs(calenderTypeValue)
  }, [calenderTypeValue])

  useEffect(() => {
    if (!calenderTypeValue) {
      return
    }
    const t = dayjs(calenderTypeValue)
    const year = t.year()
    const week = t.week()
    const weekNum = t.day()

    async function getData() {
      const res = await getDaysOfWeekList({ date: checkedTime })
      const d = res.data.find(item => item.week_no === weekNum)
      setWeekDay(d)
    }
    getData()
    //
  }, [calenderTypeValue])

  return (
    <ScheduleAllDayBox>
      <TimeZone>GTM+08</TimeZone>
      <Day>{time.format('DD')}</Day>
      <Month>{time.format('MMM')}</Month>
      <Week>{time.format('ddd')}</Week>
      {showLunar && <Lunar>{weekDay?.lunar_day_chinese}</Lunar>}
      <ScheduleList
        onClick={e => {
          e.stopPropagation()
          dispatch(
            setQuickCreateScheduleModel({
              startTime: calenderTypeValue,
              endTime: calenderTypeValue,
              visible: true,
              isAll: true,
              x: 100,
              y: 0,
            }),
          )
          dispatch(setIsAddOrDelete(false))
        }}
      >
        <ScheduleListScroll>
          {list?.map(item => {
            return (
              <AllDayScheduleItem
                onClick={e => {
                  e.stopPropagation()
                  dispatch(
                    setScheduleInfoDropdown({
                      show_date: item.date,
                      schedule_id: item.schedule_id,
                      visible: true,
                      y: 0,
                      x: 300,
                    }),
                  )
                }}
                key={item.schedule_id}
                hoverTextColor={getColor(item.color)}
                bg={getColorWithOpacityPointOne(item.color)}
                className={getColorClassName()}
              >
                <ScheduleStripContent data={item} />
              </AllDayScheduleItem>
            )
          })}
        </ScheduleListScroll>
      </ScheduleList>
    </ScheduleAllDayBox>
  )
}

export default ScheduleAllDay
