import { useSelector } from '@store/index'
import React, { useMemo } from 'react'

const useShowLunar = () => {
  const { calendarConfig } = useSelector(store => store.calendar)
  const showLunar = useMemo(() => {
    return calendarConfig?.view_options?.show_lunar_calendar === 1
  }, [calendarConfig?.view_options?.show_lunar_calendar])
  return { showLunar }
}

export default useShowLunar
