import { Calendar } from 'antd'
import React from 'react'
import CommonButton from '../CommonButton'
import IconFont from '../IconFont'
import InputSearch from '../InputSearch'
import CalendarManagerList from './components/CalendarManagerList'
import CalendarPanel from './components/CalendarPanel'
import DXCalendar from './components/DXCalendar'
import {
  CalenderBox,
  CalenderBoxLeftArea,
  CalenderBoxRightArea,
  CreateScheduleBtn,
  StyledCalendar,
} from './styles'

type CalendarManagerLayoutProps = {
  // num: string
}
type CalendarManagerLayoutHandle = {
  open(): void
}

const CalendarManagerLayout: React.ForwardRefRenderFunction<
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
      <CalenderBoxLeftArea>
        <CommonButton type="primary">
          <CreateScheduleBtn>
            <IconFont type="plus" style={{ fontSize: 15 }} />
            <span className="btnText">创建日程</span>
          </CreateScheduleBtn>
        </CommonButton>
        <DXCalendar />
        <InputSearch placeholder={'搜索日历'} width={210} autoFocus />
        <CalendarManagerList />
        <CalendarManagerList />
        <div>日历设置</div>
      </CalenderBoxLeftArea>
      <CalenderBoxRightArea>
        <CalendarPanel />
      </CalenderBoxRightArea>
    </CalenderBox>
  )
}

export default React.forwardRef(CalendarManagerLayout)
