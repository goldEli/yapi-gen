import React from 'react'
import CalendarPanel from './components/CalendarPanel'
import CalendarSidebar from './components/CalendarSidebar'
import { CalenderBox, CalenderBoxRightArea } from './styles'

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
  React.useImperativeHandle(forwardedRef, () => ({
    open() {
      alert('open')
    },
  }))
  return (
    <CalenderBox>
      <CalendarSidebar />
      <CalenderBoxRightArea>
        <CalendarPanel />
      </CalenderBoxRightArea>
    </CalenderBox>
  )
}

export default React.forwardRef(CalendarManager)
