import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { useSelector, useDispatch } from '@store/index'
import { setScheduleModal } from '@store/calendar'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import { Dropdown, Checkbox } from 'antd'
import React, { useState, useEffect } from 'react'
import ScheduleInfoIcon from './../ScheduleInfoIcon'
import DeleteConfirm from '@/components/DeleteConfirm'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)
interface ScheduleInfoDropdownProps {}
const ScheduleInfoHeader = styled.div`
  height: 136px;
  background-color: var(--primary-d1);
  padding: 16px;
  box-sizing: border-box;
  border-radius: 6px 6px 0 0;
`
const ScheduleInfoHeaderBtn = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  cursor: pointer;
`
const ScheduleInfoHeaderContent = styled.div`
  color: var(--neutral-white-d7);
  font-size: var(--font14);
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  margin-bottom: 8px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`
const ScheduleInfoHeaderDate = styled.div`
  color: var(--neutral-white-d7);
  font-size: var(--font12);
`
const statusClass = css`
  width: 40px;
  height: 22px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px 16px 16px 16px;
  opacity: 1;
  text-align: center;
  color: var(--neutral-white-d7);
  font-size: var(--font12);
  line-height: 22px;
`
const iconBox = css`
  display: flex;
  span {
    margin-left: 6px;
    color: var(--neutral-white-d6);
  }
  span:nth-child(3) {
    position: relative;
    top: -4px;
  }
`
const confirmText = css`
  color: var(--neutral-n2);
  font-size: var(--font14);
  margin-bottom: 8px;
`
const confirmSure = css`
  color: var(--neutral-n2);
  font-size: var(--font14);
  margin-left: 8px;
`
const ScheduleInfoHeaderBox: React.FC<ScheduleInfoDropdownProps> = props => {
  const [isVisible, setIsVisible] = useState(false)
  const [checked, setChecked] = useState(false)
  const { scheduleInfo } = useSelector(state => state.schedule)
  const disPatch = useDispatch()
  const onConfirm = () => {
    console.log(checked)
    setIsVisible(false)
  }
  const onChangeVisible = () => {
    setIsVisible(false)
  }
  return (
    <ScheduleInfoHeader>
      <ScheduleInfoHeaderBtn>
        <span className={statusClass}>忙碌</span>
        <div className={iconBox}>
          <span
            onClick={() => {
              disPatch(setScheduleModal({ visible: true, params: { id: 1 } }))
            }}
          >
            <ScheduleInfoIcon type="edit" />
          </span>
          <span
            onClick={() => {
              setIsVisible(true)
            }}
          >
            <ScheduleInfoIcon type="delete" />
          </span>
          <span>...</span>
          <span
            onClick={() => {
              disPatch(setScheduleInfoDropdown({ visible: false }))
            }}
          >
            <ScheduleInfoIcon type="close" />
          </span>
        </div>
      </ScheduleInfoHeaderBtn>
      <ScheduleInfoHeaderContent>
        {scheduleInfo.subject}
      </ScheduleInfoHeaderContent>
      <ScheduleInfoHeaderDate>
        {dayjs(scheduleInfo.start_datetime).format('MM月DD')} ( 周
        {dayjs(scheduleInfo.start_datetime).weekday()}){' '}
        {scheduleInfo.start_time} -{' '}
        {dayjs(scheduleInfo.end_datetime).format('MM月DD')} (周
        {dayjs(scheduleInfo.start_datetime).weekday()}) {scheduleInfo.end_time}
      </ScheduleInfoHeaderDate>
      <DeleteConfirm
        isVisible={isVisible}
        onConfirm={onConfirm}
        onChangeVisible={onChangeVisible}
        title="删除日程"
      >
        <div className={confirmText}>
          日程将删除，该日程同时会从参与者日历中移除
        </div>
        <div>
          <Checkbox
            onChange={e => {
              setChecked(e.target.checked)
            }}
          ></Checkbox>
          <span className={confirmSure}>删除后通知参与者</span>
        </div>
      </DeleteConfirm>
    </ScheduleInfoHeader>
  )
}

export default ScheduleInfoHeaderBox
