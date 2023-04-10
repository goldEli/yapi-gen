import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { useSelector } from '@store/index'
import { Dropdown } from 'antd'
import React from 'react'
import ScheduleInfoHeaderBox from './ScheduleInfoHeader'
import ScheduleInfoContent from './SCheduleInfoContent'
import ScheduleInfoFooter from './ScheduleInfoFooter'
interface ScheduleInfoDropdownProps {}
interface ScheduleInfoDropdownBoxProps {
  visible: boolean
  top: number
  left: number
}
const ScheduleInfoDropdownBox = styled.div`
  width: 320px;
  overflow-y: scroll;
  background-color: var(--neutral-white-d1);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  z-index: 10;
  display: ${(props: ScheduleInfoDropdownBoxProps) =>
    props.visible ? 'block' : 'none'};
  position: absolute;
  top: ${(props: ScheduleInfoDropdownBoxProps) => props.top + 'px'};
  left: ${(props: ScheduleInfoDropdownBoxProps) => props.left + 'px'};
  padding-bottom: 24px;
  border-radius: 6px;
`
const ScheduleInfoDropdown: React.FC<ScheduleInfoDropdownProps> = props => {
  const { scheduleInfoDropdown } = useSelector(store => store.calendarPanel)
  const { visible, x, y } = scheduleInfoDropdown
  console.log({ scheduleInfoDropdown })
  return (
    <ScheduleInfoDropdownBox
      className="schedule-info-dropdown-box"
      visible={visible}
      top={y}
      left={x}
      onClick={e => {
        e.stopPropagation()
      }}
    >
      <ScheduleInfoHeaderBox></ScheduleInfoHeaderBox>
      <ScheduleInfoContent></ScheduleInfoContent>
      <ScheduleInfoFooter></ScheduleInfoFooter>
    </ScheduleInfoDropdownBox>
  )
}

export default ScheduleInfoDropdown
