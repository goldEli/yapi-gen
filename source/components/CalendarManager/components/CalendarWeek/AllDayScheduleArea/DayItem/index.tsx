import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import classNames from 'classnames'
import { css } from '@emotion/css'
import dayjs from 'dayjs'
import useCurrentTime from '@/components/CalendarManager/hooks/useCurrentTime'
import ScheduleList from '../../ScheduleList'
import {
  resizeMonthSchedule,
  setQuickCreateScheduleModel,
  setSelectedDayInMonth,
  // moveMonthSchedule,
  startMoveMonthSchedule,
} from '@store/calendarPanle'
import { setScheduleListModal } from '@store/schedule'

interface DayItemProps {
  idx: number
  list?: (Model.Schedule.Info | undefined)[]
}

const DayItemBox = styled.div`
  user-select: none;
  width: 100%;
  padding: 12px 0;
  box-sizing: border-box;
  border-color: var(--neutral-n6-d1);
  border-style: solid;
  border-left-width: 1px;
  border-top-width: 1px;
  border-right-width: 0px;
  border-bottom-width: 0px;
  min-height: 142px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  .dayBox {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 0 12px;
    box-sizing: border-box;
  }
  .day {
    font-size: 18px;
    font-weight: 500;
    color: var(--neutral-n1-d1);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .currentDay {
    border: 1px solid var(--primary-d1);
    color: var(--primary-d1);
  }
  .dayActive {
    color: var(--neutral-white-d7);
    background: var(--primary-d1);
  }
  .daySecondaryColor {
    color: var(--neutral-n3);
  }
  .lunar {
    font-size: 12px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: var(--neutral-n4);
  }
`

const selectedBg = css`
  background-color: var(--neutral-n6-d1);
`

const borderBottom = css`
  border-bottom-width: 1px !important;
`
const borderRight = css`
  border-right-width: 1px !important;
`

const DayItem: React.FC<DayItemProps> = props => {
  const { checkedTime, selectedMonth } = useSelector(store => store.calendar)
  const { selectedDayInMonth } = useSelector(store => store.calendarPanel)
  const { idx } = props
  const info = selectedMonth?.[props.idx]
  const day = dayjs(info?.date).format('DD')
  const isSelected = dayjs(checkedTime).isSame(dayjs(info?.date), 'day')
  const { currentTime } = useCurrentTime()
  const isCurrent = currentTime.isSame(dayjs(info?.datetime), 'day')
  const dispatch = useDispatch()

  if (!info) {
    return <></>
  }

  return (
    <DayItemBox
      className={classNames({
        [selectedBg]: isSelected || selectedDayInMonth === info.datetime,
        [borderRight]: (idx + 1) % 7 === 0,
        [borderBottom]: idx > 27,
      })}
      key={idx}
      onClick={e => {
        e.stopPropagation()
        const target = e.target as HTMLDivElement
        const { offsetTop, offsetLeft } = target
        // 关闭列表
        dispatch(
          setScheduleListModal({
            visible: false,
          }),
        )
        dispatch(
          setQuickCreateScheduleModel({
            visible: true,
            isAll: true,
            startTime: info.datetime,
            endTime: info.datetime,
            x: offsetLeft,
            y: offsetTop,
          }),
        )
        dispatch(setSelectedDayInMonth(info.datetime))
      }}
      onMouseEnter={e => {
        console.log('window.calendarPanel.type', window.calendarMonthPanelType)
        if (window.calendarMonthPanelType === 'move') {
          dispatch(
            startMoveMonthSchedule({
              endIndex: props.idx,
            }),
          )
        }
        if (window.calendarMonthPanelType === 'resize') {
          dispatch(
            resizeMonthSchedule({
              endIndex: props.idx,
            }),
          )
        }
      }}
    >
      {/* <div className="dayBox">
        <span
          className={classNames('day', {
            dayActive: isSelected,
            daySecondaryColor: !info?.is_current_month && !isSelected,
            currentDay: isCurrent,
          })}
        >
          {day}
        </span>
        <span className="lunar">{info?.lunar_day_chinese}</span>
      </div> */}
      <ScheduleList data={info} idx={idx} list={props.list} />
    </DayItemBox>
  )
}

export default DayItem
