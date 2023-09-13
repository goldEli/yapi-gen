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
import ScheduleInfoDropdown from './components/ScheduleInfoDropdown'
import QuickCreateScheduleModel from './components/QuickCreateScheduleModel'
type CalendarManagerLayoutProps = {
  // num: string
}

const CalendarManager: React.FC<CalendarManagerLayoutProps> = props => {
  const { routerMenu, checkedTime, checkedCalendarList } = useSelector(
    store => store.calendar,
  )
  const { isRefresh } = useSelector(store => store.user)
  const { isAddOrDelete } = useSelector(state => state.schedule)
  const dispatch = useDispatch()
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
    if (isRefresh) {
      // 获取相应配置
      dispatch(getRelateConfig())
      dispatch(getCalendarConfig())
    }
  }, [isRefresh])
  const getParams = () => {
    let params = {
      year: dayjs(checkedTime).year(),
      month: dayjs(checkedTime).month() + 1,
      calendar_ids: checkedCalendarList.map(item => item.calendar_id),
    }
    return params
  }
  useEffect(() => {
    if (checkedCalendarList.length === 0) return
    dispatch(getLeftCalendarDaysOfMonthList(getParams()))
  }, [checkedTime, checkedCalendarList])
  useEffect(() => {
    if (isAddOrDelete) {
      dispatch(getLeftCalendarDaysOfMonthList(getParams()))
    }
  }, [isAddOrDelete])
  return (
    <CalenderBox>
      <CreateSchedule />
      <CalendarSidebar />
      <CalenderBoxRightArea id="calenderBoxRightArea">
        {!routerMenu.key && <CalendarPanel />}
        {routerMenu.key && <CalendarSet />}
      </CalenderBoxRightArea>
      <ScheduleInfoDropdown></ScheduleInfoDropdown>
      <QuickCreateScheduleModel containerClassName="" />
    </CalenderBox>
  )
}

export default CalendarManager
