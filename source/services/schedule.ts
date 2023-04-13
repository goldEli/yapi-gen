import * as http from '@/tools/http'
import { addIdToScheduleList } from './utils'

// 日程列表
// export const getScheduleList = async (
//   params: API.Schedule.GetScheduleList.Params,
// ) => {
//   const res = addIdToScheduleList(scheduleListMockData.data)
//   scheduleListMockData.data = res
//   return Promise.resolve(scheduleListMockData)
//   const response = await http.get<any, API.Schedule.GetScheduleList.Result>(
//     'getScheduleList',
//     params,
//   )
//   return response
// }
// 日视图 日程列表
export const getScheduleListDaysOfDate = async (
  params: API.Schedule.GetScheduleListDaysOfDate.Params,
) => {
  const response = await http.post<
    any,
    API.Schedule.GetScheduleListDaysOfDate.Result
  >('getScheduleListDaysOfDate', params)
  const res = addIdToScheduleList(response.data)
  return res
}

// 周视图 日程列表
export const getScheduleListDaysOfWeek = async (
  params: API.Schedule.GetScheduleListDaysOfWeek.Params,
) => {
  const response = await http.post<
    any,
    API.Schedule.GetScheduleListDaysOfWeek.Result
  >('getScheduleListDaysOfWeek', params)
  const res = addIdToScheduleList(response.data)
  return res
}

export const getScheduleListDaysOfMonth = async (
  params: API.Schedule.GetScheduleListDaysOfMonth.Params,
) => {
  const response = await http.post<
    any,
    API.Schedule.GetScheduleListDaysOfMonth.Result
  >('getScheduleListDaysOfMonth', params)
  const res = addIdToScheduleList(response.data)
  return res
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

// 获取日程详情
export const getScheduleInfo = async (params: { id: number }) => {
  const response = await http.get<any, any>(`/b/schedule/${params.id}`)
  return response.data
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
