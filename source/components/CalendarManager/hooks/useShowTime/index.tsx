import React from 'react'
import useAllDay from '../useAllDay'
import { useTranslation } from 'react-i18next'

const useShowTime = (data?: Model.Schedule.Info) => {
  const { isAcrossDay, isFullDay } = useAllDay({ data })
  const [t] = useTranslation()

  // 如果是跨天或者全天任务显示全天
  const timeStr = React.useMemo(() => {
    if (isFullDay) {
      return t('calendarManager.allDay')
    }
    if (isAcrossDay) {
      return t('calendarManager.acrossDay')
    }
    return data?.start_time
  }, [data?.start_time, isFullDay, isAcrossDay])

  return { timeStr }
}

export default useShowTime
