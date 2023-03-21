import React from 'react'
import CommonButton from '../CommonButton'
import {
  CalenderBox,
  CalenderBoxLeftArea,
  CalenderBoxRightArea,
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
        <CommonButton type="primary">123</CommonButton>
      </CalenderBoxLeftArea>
      <CalenderBoxRightArea></CalenderBoxRightArea>
    </CalenderBox>
  )
}

export default React.forwardRef(Calendar)
