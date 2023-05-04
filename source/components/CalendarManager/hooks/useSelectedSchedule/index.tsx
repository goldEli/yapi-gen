import { useSelector } from '@store/index'
import React, { useMemo } from 'react'

/**
 * 是否被选中
 * 点击查看详情弹窗
 */
const useSelectedSchedule = (data?: Model.Schedule.Info) => {
  const { scheduleInfoDropdown } = useSelector(store => store.calendarPanel)

  const selected = useMemo(() => {
    if (!scheduleInfoDropdown.visible) {
      return false
    }
    return data?.schedule_id === scheduleInfoDropdown.schedule_id
  }, [data, scheduleInfoDropdown])

  return { selected }
}

export default useSelectedSchedule
