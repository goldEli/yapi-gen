import * as http from '@/tools/http'
import { scheduleListMockData } from './mockData'
import { addIdToScheduleList } from './utils'

// 日程列表
export const getScheduleList = async (
  params: API.Schedule.GetScheduleList.Params,
) => {
  const res = addIdToScheduleList(scheduleListMockData.data)
  return Promise.resolve(res)
  const response = await http.get<any, API.Schedule.GetScheduleList.Result>(
    'getScheduleList',
    params,
  )
  return response
}

// 创建日程
export const saveScheduleList = async (
  params: API.Schedule.SaveSchedule.Params,
) => {
  const response = await http.post<any, API.Schedule.SaveSchedule.Result>(
    'saveSchedule',
    params,
  )
  return response
}
// 获取年日程数据列表
export const getCalendarDaysOfYearList = async (
  params: API.Schedule.ScheduleInfoList.Params,
) => {
  const res = await http.post('getCalendarDaysOfYearList', params)
  return res
}

// 获取列表日历日程
export const getCalendarDaysOfMonthList = async (
  params: API.Schedule.ScheduleInfoList.Params,
) => {
  const res = await http.post('getCalendarDaysOfMonthList', params)
  return res
}
