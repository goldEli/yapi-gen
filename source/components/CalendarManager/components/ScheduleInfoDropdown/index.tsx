import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { Dropdown } from 'antd'
import React from 'react'

interface ScheduleInfoDropdownProps {}
interface ScheduleInfoDropdownBoxProps {
  visible: boolean
  top: number
  left: number
}
const ScheduleInfoDropdownBox = styled.div`
  width: 528px;
  height: 636px;
  background-color: var(--neutral-white-d1);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  z-index: 10;
  display: ${(props: ScheduleInfoDropdownBoxProps) =>
    props.visible ? 'block' : 'none'};
  position: absolute;
  top: ${(props: ScheduleInfoDropdownBoxProps) => props.top + 'px'};
  left: ${(props: ScheduleInfoDropdownBoxProps) => props.left + 'px'};
`

const ScheduleInfoDropdown: React.FC<ScheduleInfoDropdownProps> = props => {
  const { scheduleInfoDropdown } = useSelector(store => store.calendarPanel)
  const { visible, x, y } = scheduleInfoDropdown
  return (
    <ScheduleInfoDropdownBox visible={visible} top={y} left={x}>
      日程详情
    </ScheduleInfoDropdownBox>
  )
}

export default ScheduleInfoDropdown
