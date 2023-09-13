import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { useSelector, useDispatch } from '@store/index'
import { Dropdown, Spin, Drawer } from 'antd'
import React, { useEffect, useRef } from 'react'
import ScheduleInfoHeaderBox from './ScheduleInfoHeader'
import ScheduleInfoContent from './SCheduleInfoContent'
import ScheduleInfoFooter from './ScheduleInfoFooter'
import useModalPosition from '../../hooks/useModalPosition'
import { getScheduleInfo } from '@store/schedule/schedule.thunk'
import dayjs from 'dayjs'
import NewLoadingTransition from '@/components/NewLoadingTransition'
interface ScheduleInfoDropdownProps {
  containerClassName?: string
}
const ScheduleInfoDropdownBox = styled.div<{
  visible: boolean
  top: number
  left: number
}>`
  width: 420px;
  background-color: var(--neutral-white-d1);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  z-index: 999;
  display: ${props => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  right: 0px;
  padding-bottom: 24px;
  border-radius: 6px;
  height: 100%;
`
const ScheduleInfoDropdown: React.FC<ScheduleInfoDropdownProps> = props => {
  const { scheduleInfoDropdown } = useSelector(store => store.calendarPanel)
  const { schedule_id, show_date } = scheduleInfoDropdown
  const { visible } = scheduleInfoDropdown
  const { position } = useModalPosition({
    ...scheduleInfoDropdown,
    containerClassName: props.containerClassName ?? '',
    modalInfo: {
      width: 320,
      height: 640,
    },
  })
  const { scheduleInfo } = useSelector(state => state.schedule)

  const disPatch = useDispatch()
  useEffect(() => {
    if (!schedule_id || !visible) return
    disPatch(getScheduleInfo({ id: schedule_id, show_date }))
  }, [schedule_id, visible])

  return (
    <Drawer open={visible} mask={false}>
      <ScheduleInfoDropdownBox
        className="schedule-info-dropdown-box"
        visible={visible && !!position}
        top={position?.y ?? 0}
        left={position?.x ?? 0}
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <Spin
          indicator={<NewLoadingTransition />}
          spinning={scheduleInfo ? false : true}
        >
          <ScheduleInfoHeaderBox></ScheduleInfoHeaderBox>
          <ScheduleInfoContent
            showFooter={scheduleInfo?.is_show_reply ?? false}
          ></ScheduleInfoContent>
          <ScheduleInfoFooter></ScheduleInfoFooter>
        </Spin>
      </ScheduleInfoDropdownBox>
    </Drawer>
  )
}

export default ScheduleInfoDropdown
