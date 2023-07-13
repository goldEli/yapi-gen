import { useDispatch, useSelector } from '@store/index'
import dayjs from 'dayjs'
import React from 'react'
import useCurrentTime from '../useCurrentTime'
import { setScheduleListModal, setIsAddOrDelete } from '@store/schedule'
import {
  resizeMonthSchedule,
  setQuickCreateScheduleModel,
  setSelectedDayInMonth,
  startMoveMonthSchedule,
  //   setSelectedDayInMonth,
} from '@store/calendarPanle'
import classNames from 'classnames'
import { css } from '@emotion/css'

const selectedBg = css`
  background-color: var(--function-tag6);
`

const borderBottom = css`
  border-bottom-width: 1px !important;
`
const borderRight = css`
  border-right-width: 1px !important;
`

const useAllDayGrid = (props: {
  info?: Model.Calendar.DaysOfMonth
  idx: number
  showSelectedBg: boolean
  showBorderRight: boolean
  showBorderBottom: boolean
}) => {
  const { info } = props

  const dispatch = useDispatch()

  const classnames = React.useMemo(() => {
    return classNames({
      [selectedBg]: props.showSelectedBg,
      [borderRight]: props.showBorderRight,
      [borderBottom]: props.showBorderBottom,
    })
  }, [props.showSelectedBg, props.showBorderRight, props.showBorderBottom])

  const openQuickCreateScheduleModel = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
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
        startTime: info?.datetime,
        endTime: info?.datetime,
        x: offsetLeft,
        y: offsetTop,
      }),
    )
    dispatch(setIsAddOrDelete(false))
  }

  const onMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
  }
  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 如果拖拽了日程 不触发创建
    if (window.isMovingSchedule) {
      return
    }
    openQuickCreateScheduleModel(e)
    dispatch(setSelectedDayInMonth(info?.datetime))
  }
  return {
    classnames,
    openQuickCreateScheduleModel,
    onMouseEnter,
    onClick,
  }
}

export default useAllDayGrid
