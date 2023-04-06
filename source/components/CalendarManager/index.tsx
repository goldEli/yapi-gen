import { setRouterMenu } from '@store/calendar'
import { useDispatch, useSelector } from '@store/index'
import React, { useEffect } from 'react'
import CalendarPanel from './components/CalendarPanel'
import CalendarSet from './components/CalendarSet'
import CalendarSidebar from './components/CalendarSidebar'
import { CalenderBox, CalenderBoxRightArea } from './styles'
import CreateSchedule from './components/CreateSchedule'

type CalendarManagerLayoutProps = {
  // num: string
}
type CalendarManagerLayoutHandle = {
  open(): void
}

const CalendarManager: React.ForwardRefRenderFunction<
  CalendarManagerLayoutHandle,
  CalendarManagerLayoutProps
> = (props, forwardedRef) => {
  const { routerMenu } = useSelector(store => store.calendar)
  const dispatch = useDispatch()

  // 初始化获取当前是设置页还是看板页
  useEffect(() => {
    const calendarSet = localStorage.getItem('calendarSetKey')
    const resultMenu = { name: '', key: calendarSet ?? '' }
    dispatch(setRouterMenu(resultMenu))
  }, [])

  React.useImperativeHandle(forwardedRef, () => ({
    open() {
      alert('open')
    },
  }))
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

export default React.forwardRef(CalendarManager)
