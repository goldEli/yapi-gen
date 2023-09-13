/* eslint-disable no-undefined */
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import React from 'react'
import { useSelector, useDispatch } from '@store/index'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import { setScheduleListModal, setScheduleInfo } from '@store/schedule'
import dayjs from 'dayjs'
import { getColorWithOpacityPointOne, getColor } from '../../utils'
interface ScheduleListProps {}
interface ScheduleListBoxProps {
  visible: boolean
  top?: number
  left?: number
}
const ScheduleListBox = styled.div`
  width: 260px;
  height: 200px;
  max-height: 400px;
  overflow: scroll;
  position: absolute;
  top: ${(props: ScheduleListBoxProps) => props.top + 'px'};
  left: ${(props: ScheduleListBoxProps) => props.left + 'px'};
  display: ${(props: ScheduleListBoxProps) =>
    props.visible ? 'block' : 'none'};
  background: #fff;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
  z-index: 999;
  padding-left: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-right: 1px;
  box-sizing: border-box;
`
const ScheduleItem = styled.div<{ color: string }>`
  font-size: 12px;

  color: #646566;
  margin-bottom: 4px;
  padding-left: 6px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: 28px;
  /* border: 1px solid; */
  cursor: pointer;
  &:hover {
    background: ${props => props.color};
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

  color: var(--neutral-n4);
  margin-right: 8px;
  position: relative;
  padding-left: 14px;
  font-family: SiYuanRegular;
  /* &::before {
    width: 6px;
    height: 6px;
    background: var(--primary-d1);
    border-radius: 2px 2px 2px 2px;
    display: inline-block;
    content: '';
    margin-right: 8px;
    position: relative;
    top: -2px;
  } */
`
const Dot = styled.div<{ color: string }>`
  position: absolute;
  top: 7px;
  width: 6px;
  height: 6px;
  background: ${props => props.color};
  border-radius: 2px 2px 2px 2px;
  left: 0px;
`
const labelContent = css`
  font-size: 12px;

  color: var(--neutral-n2);
  line-height: 20px;
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
  width: calc(100% - 110px);
  font-family: SiYuanRegular;
`
const dateClass = css`
  color: var(--neutral-n1-d1);
  font-size: 16px;
  margin-right: 8px;
`
const gregorianDateClass = css`
  color: var(--neutral-n3);
  font-size: 12px;
  font-family: SiYuanRegular;
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
    disPatch(setScheduleInfo(undefined))
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
          color={getColorWithOpacityPointOne(item.color)}
        >
          <span className={labelTime}>
            <Dot color={getColor(item.color)}></Dot>
            {item.start_time}-{item.end_time}
          </span>
          <span className={labelContent} title={item.subject}>
            {item.subject}
          </span>
        </ScheduleItem>
      ))}
    </ScheduleListBox>
  )
}
export default ScheduleListModal
