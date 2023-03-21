import React from 'react'
import CommonButton from '../CommonButton'
import IconFont from '../IconFont'
import {
  CalenderBox,
  CalenderBoxLeftArea,
  CalenderBoxRightArea,
  CreateScheduleBtn,
} from './styles'

type CalendarProps = {
  // num: string
}
type CalendarHandle = {
  open(): void
}

const Calendar: React.ForwardRefRenderFunction<
  CalendarHandle,
  CalendarProps
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
      </CalenderBoxLeftArea>
      <CalenderBoxRightArea></CalenderBoxRightArea>
    </CalenderBox>
  )
}

export default React.forwardRef(Calendar)
