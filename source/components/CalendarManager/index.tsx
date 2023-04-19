import { setRouterMenu } from '@store/calendar'
import { useDispatch, useSelector } from '@store/index'
import React, { useEffect } from 'react'
import CalendarPanel from './components/CalendarPanel'
import CalendarSet from './components/CalendarSet'
import CalendarSidebar from './components/CalendarSidebar'
import { CalenderBox, CalenderBoxRightArea } from './styles'
import CreateSchedule from './components/CreateSchedule'
import dayjs from 'dayjs'
import {
  getCalendarConfig,
  getRelateConfig,
} from '@store/calendar/calendar.thunk'
import { getLeftCalendarDaysOfMonthList } from '@store/schedule/schedule.thunk'
type CalendarManagerLayoutProps = {
  // num: string
}

const CalendarManager: React.FC<CalendarManagerLayoutProps> = props => {
  const { routerMenu } = useSelector(store => store.calendar)
  const { checkedTime } = useSelector(store => store.calendar)
  const dispatch = useDispatch()
  const { calendarData } = useSelector(state => state.calendar)
  const { checkedCalendarList } = useSelector(state => state.calendar)
  let data = calendarData?.manager.concat(calendarData?.subscribe)
  // 初始化获取当前是设置页还是看板页
  useEffect(() => {
    const calendarSet = localStorage.getItem('calendarSetKey')
    const resultMenu = { name: '', key: calendarSet ?? '' }
    dispatch(setRouterMenu(resultMenu))
    // 获取相应配置
    dispatch(getRelateConfig())
    dispatch(getCalendarConfig())
  }, [])
  useEffect(() => {
    let params = {
      year: dayjs(checkedTime).year(),
      month: dayjs(checkedTime).month() + 1,
      calendar_ids: data.map(item => item.calendar_id),
    }
    setTimeout(() => {
      console.log(111111, checkedCalendarList)
    }, 300)

    dispatch(getLeftCalendarDaysOfMonthList(params))
  }, [checkedTime])

  return (
    <CalenderBox>
      <CreateSchedule />
      <CalendarSidebar />
      <CalenderBoxRightArea id="calenderBoxRightArea">
        {!routerMenu.key && <CalendarPanel />}
        {routerMenu.key && <CalendarSet />}
      </CalenderBoxRightArea>
    </CalenderBox>
  )
}

export default CalendarManager
