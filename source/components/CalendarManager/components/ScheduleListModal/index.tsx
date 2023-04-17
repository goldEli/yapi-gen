import styled from '@emotion/styled'
import { css } from '@emotion/css'
import React from 'react'
import { useSelector, useDispatch } from '@store/index'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import { setScheduleListModal } from '@store/schedule'
import ScheduleInfoDropdown from '../ScheduleInfoDropdown'
import dayjs from 'dayjs'
interface ScheduleListProps {
  month: number
}
interface ScheduleListBoxProps {
  visible: boolean
  top?: number
  left?: number
}
const ScheduleListBox = styled.div`
  width: 260px;
  height: 200px;
  position: absolute;
  top: ${(props: ScheduleListBoxProps) => props.top + 'px'};
  left: ${(props: ScheduleListBoxProps) => props.left + 'px'};
  display: ${(props: ScheduleListBoxProps) =>
    props.visible ? 'block' : 'none'};
  background: #fff;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
  z-index: 999;
  padding-left: 16px;
  padding-top: 4px;
  padding-bottom: 4px;
  box-sizing: border-box;
`
const ScheduleItem = styled.div`
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #646566;
  margin-bottom: 4px;
  padding-left: 6px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background: rgba(102, 136, 255, 0.1);
    border-radius: 6px;
  }
`
const ScheduleTitle = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
`
const labelTime = css`
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(---neutral-n4);
  margin-right: 8px;
  position: relative;
  &::before {
    width: 6px;
    height: 6px;
    background: var(--primary-d1);
    border-radius: 2px 2px 2px 2px;
    display: inline-block;
    content: '';
    margin-right: 8px;
    position: relative;
    top: -2px;
  }
`
const labelContent = css`
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n2);
  line-height: 20px;
`
const dateClass = css`
  color: var(--neutral-n1-d1);
  font-size: 16px;
  margin-right: 8px;
`
const gregorianDateClass = css`
  color: var(--neutral-n3);
  font-size: 12px;
`
const ScheduleListModal: React.FC<ScheduleListProps> = props => {
  const { scheduleListModal } = useSelector(state => state.schedule)
  const scheduleInfo = useSelector(
    state => state.calendarPanel.scheduleInfoDropdown,
  )
  const disPatch = useDispatch()
  const { visible, top, left, date, scheduleListData = [] } = scheduleListModal
  const scheduleInfoClick = (e: any, schedule_id: number) => {
    e.stopPropagation()
    disPatch(setScheduleInfoDropdown({ visible: true, schedule_id }))
    disPatch(setScheduleListModal({ visible: false }))
  }
  return (
    <ScheduleListBox visible={visible} top={top} left={left}>
      <ScheduleTitle>
        <span className={dateClass}>{date}</span>
        <span className={gregorianDateClass}>
          {scheduleListData[0]?.lunar_day_chinese}
        </span>
      </ScheduleTitle>
      {scheduleListData.map((item: Model.Schedule.Info) => (
        <ScheduleItem
          key={item.schedule_id}
          onClick={e => scheduleInfoClick(e, item.schedule_id)}
        >
          <span className={labelTime}>
            {item.start_time}-{item.end_time}
          </span>
          <span className={labelContent}>{item.subject}</span>
        </ScheduleItem>
      ))}
      <ScheduleInfoDropdown></ScheduleInfoDropdown>
    </ScheduleListBox>
  )
}
export default ScheduleListModal
