import React from 'react'
import { isSameTime } from '../../utils'

const useAllDay = (props: { data: Model.Schedule.Info }) => {
  const { data } = props
  const { start_timestamp, schedule_start_datetime } = props.data
  // 全天(包含跨天)
  const isAllDay = data.is_all_day === 1 || data.is_span_day
  // 跨天
  const isAcrossDayFirstDay =
    isAllDay && isSameTime(start_timestamp, schedule_start_datetime ?? 0)
  // 跨天但不是第一天
  const isAcrossDayButNotFirstDay =
    data.is_span_day &&
    !isSameTime(start_timestamp, schedule_start_datetime ?? 0)

  // 跨天最后一天
  const isAcrossDayAndLastDay =
    data.is_span_day &&
    isSameTime(props.data.end_timestamp, props.data.schedule_end_datetime ?? 0)

  // 跨天日程
  const isAcrossDay = data.is_span_day

  return {
    isAllDay,
    isAcrossDayFirstDay,
    isAcrossDayButNotFirstDay,
    isAcrossDayAndLastDay,
    isAcrossDay,
  }
}

export default useAllDay
