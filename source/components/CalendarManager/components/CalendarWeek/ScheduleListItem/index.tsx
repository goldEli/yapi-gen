import React, { useEffect, useMemo, useState } from 'react'

import dayjs from 'dayjs'

import { store, useDispatch, useSelector } from '@store/index'
import {
  clearMonthMoveScheduleActiveInfo,
  resizeMonthSchedule,
  setScheduleInfoDropdown,
  // moveMonthSchedule,
  startMoveMonthSchedule,
} from '@store/calendarPanle'
import useScheduleListArr from '../hooks/useScheduleListArr'
import useRelativePosition from '@/components/CalendarManager/hooks/useRelativePosition'
import _ from 'lodash'
import { modifySchedule } from '@store/schedule/schedule.thunk'
import {
  formatYYYYMMDD,
  formatYYYYMMDDhhmmss,
} from '@/components/CalendarManager/config'
import ScheduleStrip from '../../ScheduleStrip'
import useAllDay from '@/components/CalendarManager/hooks/useAllDay'

interface ScheduleListItemProps {
  data: Model.Schedule.Info
  idx: number
}

const ScheduleListItem: React.FC<ScheduleListItemProps> = props => {
  const { data } = props
  const { monthMoveScheduleActiveInfo } = useSelector(
    store => store.calendarPanel,
  )

  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // 清空拖动数据
    dispatch(clearMonthMoveScheduleActiveInfo())
  }, [data])

  const { isAcrossDayButNotFirstDay } = useAllDay({ data: props.data })

  const isDrag = React.useRef(false)
  const domRef = React.useRef(null)

  const { len } = useScheduleListArr(data.schedule_id)
  const dispatch = useDispatch()
  const { position } = useRelativePosition(
    `${props.data.id}`,
    '.calendar-week-all-day-box',
  )

  const show = useMemo(() => {
    return (
      monthMoveScheduleActiveInfo?.startSchedule?.schedule_id !==
      data.schedule_id
    )
  }, [monthMoveScheduleActiveInfo, data.schedule_id, visible])

  // 打开详情弹窗
  const onOpenScheduleDetail = () => {
    dispatch(
      setScheduleInfoDropdown({
        show_date: props.data.date,
        schedule_id: props.data.schedule_id,
        visible: true,
        x: position?.x,
        y: position?.y,
      }),
    )
  }

  // 移动日程后后保存
  const onSave = () => {
    const info = store.getState().calendarPanel.monthMoveScheduleActiveInfo
    if (!info?.startSchedule) {
      throw new Error('info?.startSchedule is undefine')
    }
    const {
      schedule_id,
      color,
      subject,
      calendar_id,
      schedule_start_datetime,
      schedule_end_datetime,
    } = info?.startSchedule
    // 移动了多少天，负数表示向前移动，正数表示先后移动
    const movedDay = (info.endIndex ?? 0) - (info.startIndex ?? 0)
    const newStart = dayjs(schedule_start_datetime)
      .add(movedDay, 'day')
      .format(formatYYYYMMDDhhmmss)
    const newEnd = dayjs(schedule_end_datetime)
      .add(movedDay, 'day')
      .format(formatYYYYMMDDhhmmss)
    if (
      newStart === schedule_start_datetime &&
      newEnd === schedule_end_datetime
    ) {
      // 清空拖动数据
      dispatch(clearMonthMoveScheduleActiveInfo())
      return
    }
    const params = {
      calendar_id,
      schedule_id,
      color,
      subject,
      start_datetime: newStart,
      end_datetime: newEnd,
    }
    dispatch(modifySchedule(params))
  }

  // 调整头天后保存
  const onSaveForResizingFirstDay = () => {
    const info = store.getState().calendarPanel.monthMoveScheduleActiveInfo
    if (!info?.startSchedule) {
      throw new Error('info?.startSchedule is undefine')
    }
    const {
      schedule_id,
      color,
      subject,
      calendar_id,
      schedule_start_datetime,
      schedule_end_datetime,
    } = info?.startSchedule
    const { visibleList } = info
    // 移动了多少天，负数表示向前移动，正数表示先后移动
    // const movedDay = (info.endIndex ?? 0) - (info.startIndex ?? 0)
    if (!visibleList?.length) {
      throw new Error('visibleList?.length is zero')
    }
    const len = visibleList?.length
    const movedDay = (len - 1) * -1
    const startYMD = dayjs(schedule_end_datetime)
      .add(movedDay, 'day')
      .format(formatYYYYMMDD)

    const newStart = dayjs(startYMD).format(formatYYYYMMDDhhmmss)
    const newEnd = dayjs(schedule_end_datetime).format(formatYYYYMMDDhhmmss)
    if (
      newStart === schedule_start_datetime &&
      newEnd === schedule_end_datetime
    ) {
      // 清空拖动数据
      dispatch(clearMonthMoveScheduleActiveInfo())
      return
    }

    const params = {
      calendar_id,
      schedule_id,
      color,
      subject,
      start_datetime: newStart,
      end_datetime: newEnd,
    }
    dispatch(modifySchedule(params))
  }

  // 点击日程
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 跨天如果不是头天不能拖动
    if (isAcrossDayButNotFirstDay) {
      return
    }
    // e.stopPropagation()
    isDrag.current = false
    // 设置类型 move 还是 resize
    window.calendarMonthPanelType = 'move'
    // 是否执行过
    let isRun = false
    const handleMove = (e: MouseEvent) => {
      if (isRun) {
        return
      }
      setVisible(false)
      isRun = true
      isDrag.current = true
      dispatch(
        startMoveMonthSchedule({
          startSchedule: props.data,
          startIndex: props.idx,
          endIndex: props.idx,
          length: len,
        }),
      )
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', async e => {
      // 重置
      window.calendarMonthPanelType = null
      window.removeEventListener('mousemove', handleMove)
      /**
       * 点击查看详情
       * 1. 如果拖动不查看
       * 2. 跨天日程只有第一天才能点
       */
      if (!isDrag.current && !isAcrossDayButNotFirstDay) {
        onOpenScheduleDetail()
        return
      }
      // 拖动之后保存日程
      if (isDrag.current) {
        onSave()
      }
    })
  }

  // 拖拽头部
  const onDotMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    window.calendarMonthPanelType = 'resize'
    dispatch(
      resizeMonthSchedule({
        startSchedule: props.data,
        startIndex: props.idx,
        endIndex: props.idx,
        length: len,
      }),
    )
    const onMouseupForDot = (e: MouseEvent) => {
      onSaveForResizingFirstDay()
      window.calendarMonthPanelType = null
    }
    window.removeEventListener('mouseup', onMouseupForDot)
    window.addEventListener('mouseup', onMouseupForDot)
  }

  return (
    <ScheduleStrip
      data={props.data}
      ref={domRef}
      visible={show}
      onMouseDown={onMouseDown}
      onDotMouseDown={onDotMouseDown}
    />
  )
}

export default ScheduleListItem
