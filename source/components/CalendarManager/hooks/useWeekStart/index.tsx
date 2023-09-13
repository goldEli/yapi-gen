import { useSelector } from '@store/index'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(updateLocale)
// 处理从周几开始
const useWeekStart = () => {
  const week_first_day =
    useSelector(
      store => store.calendar.calendarConfig.view_options?.week_first_day,
    ) ?? 0

  // 日历从周几开始
  useEffect(() => {
    const lan = localStorage.getItem('language') || 'zh'
    dayjs.updateLocale(lan.includes('zh') ? 'zh-cn' : lan, {
      weekStart: week_first_day,
    })
  }, [week_first_day])
}

export default useWeekStart
