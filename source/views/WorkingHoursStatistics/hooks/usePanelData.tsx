import React from 'react'
import dayjs from 'dayjs'
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
        child.push({ name: ele.name, hour: item.hour, time: item.time })
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
  return {
    columns,
    map,
    reduceMonth,
  }
}
export default usePanelData
