import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { useSelector,useDispatch } from '@store/index'
import { Dropdown } from 'antd'
import React,{useEffect} from 'react'
import ScheduleInfoHeaderBox from './ScheduleInfoHeader'
import ScheduleInfoContent from './SCheduleInfoContent'
import ScheduleInfoFooter from './ScheduleInfoFooter'
import useModalPosition from '../../hooks/useModalPosition'
import {getScheduleInfo} from '@store/schedule/schedule.thunk'
interface ScheduleInfoDropdownProps {
  containerClassName?: string
}
const ScheduleInfoDropdownBox = styled.div<{
  visible: boolean
  top: number
  left: number
}>`
  width: 320px;
  overflow-y: scroll;
  background-color: var(--neutral-white-d1);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  z-index: 100;
  display: ${props => (props.visible ? 'block' : 'none')};
  position: absolute;
  top: ${props => props.top + 'px'};
  left: ${props => props.left + 'px'};
  padding-bottom: 24px;
  border-radius: 6px;
`
const ScheduleInfoDropdown: React.FC<ScheduleInfoDropdownProps> = props => {
  const { scheduleInfoDropdown } = useSelector(store => store.calendarPanel);
  const {schedule_id}=scheduleInfoDropdown
  console.log('scheduleInfoDropdown----',scheduleInfoDropdown)
  const { visible } = scheduleInfoDropdown
  const { position } = useModalPosition({
    ...scheduleInfoDropdown,
    containerClassName: props.containerClassName,
    modalClassName: '.schedule-info-dropdown-box',
  })
  // console.log({ scheduleInfoDropdown })
  const disPatch=useDispatch()
  useEffect(() => {
    if(!schedule_id) return
    disPatch(getScheduleInfo({id:schedule_id}))
  }, [schedule_id])
  
  return (
    <ScheduleInfoDropdownBox
      className="schedule-info-dropdown-box"
      visible={visible && !!position}
      top={position?.y ?? 0}
      left={position?.x ?? 0}
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
