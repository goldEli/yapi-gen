import React from 'react'
import dayjs from 'dayjs'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
const usePanelData = (data: any[], array: any[]) => {
  //   if (!data) {
  //     return
  //   }
  //   if (!array.length) {
  //     return
  //   }
  const columns = data?.map(item => item.date)
  const map = new Map()
  columns?.forEach(item => {
    map.set(item, [])
  })
  array?.forEach((ele: any) => {
    ele.work_times?.forEach((item: any) => {
      if (map.has(item.date)) {
        const child = map.get(item.date)
        child.push({
          time: item.time,
          user_id: ele.user_id,
          story_id: ele.story?.id,
          project_id: ele.project_id,
          id: ele.id ?? ele?.user?.id,
        })
        map.set(item.date, child)
      }
    })
  })
  // 按月份归类
  const reduceMonth = (dates: any[]) => {
    const result = dates.reduce((obj, date) => {
      const key = dayjs(date).endOf('month').format('YYYY-MM-DD')
      obj[key] = obj[key] || []
      obj[key].push(date)
      return obj
    }, {})
    return result
  }
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id } = paramsData
  return {
    columns,
    map,
    reduceMonth,
    projectId: id,
  }
}
export default usePanelData
