import { useSelector } from '@store/index'
import { useState, useEffect } from 'react'
import useWeeks from './useWeeks'

type ShowInfo = {
  show: boolean
  hiddenNum?: number
  weekDay?: string
}

const useAllDayMoreTitleShowInfoList = () => {
  const [showInfoList, setShowInfoList] = useState<ShowInfo[]>([])

  const scheduleList = useSelector(store => store.schedule.scheduleList)
  const { weeks } = useWeeks()

  useEffect(() => {
    const res: ShowInfo[] = []
    for (const week of weeks) {
      //   const key = dayjs(week).format(formatYYYYMMDD)
      const data = scheduleList[week]?.filter(
        item => item.is_all_day === 1 || item.is_span_day,
      )
      // 最多展示两个
      if (data?.length > 2) {
        res.push({
          weekDay: week,
          show: true,
          hiddenNum: data.length - 2,
        })
      } else {
        res.push({
          show: false,
        })
      }
    }
    setShowInfoList(res)
  }, [scheduleList, weeks])

  return {
    showInfoList,
  }
}

export default useAllDayMoreTitleShowInfoList
