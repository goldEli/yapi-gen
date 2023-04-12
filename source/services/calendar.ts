import urls from '@/constants/urls'
import * as http from '@/tools/http'

// 订阅日历列表 -- finish-1
export const getSubscribeList = async (
  params: API.Calendar.GetSubscribeList.Params,
) => {
  const response = await http.get<any, API.Calendar.GetSubscribeList.Result>(
    `/b/calendar/${params.type}/getAllCalendarList`,
    {
      keywords: params.keywords,
      page: params.page,
      page_size: 10,
    },
  )
  return response
}

// 订阅联系人列表 -- finish -1
export const getContactsCalendarList = async (
  params: API.Calendar.GetContactsCalendarList.Params,
) => {
  const response = await http.get<
    any,
    API.Calendar.GetContactsCalendarList.Result
  >('getContactsCalendarList', {
    username: params.username,
    page: params.page,
    page_size: 10,
  })
  return response
}

// 日历列表 我管理的、我订阅的 -- finish
export const getCalendarList = async () => {
  const response = await http.get<any, API.Calendar.GetCalendarList.Result>(
    'getUserCalendars',
  )
  return response
}

// 获取日历相关配置下拉 -- finish
export const getRelateConfig = async () => {
  const response = await http.get<any, API.Calendar.GetRelateConfig.Result>(
    'getRelateConfig',
  )
  return response
}

// 创建日历 -- finish
export const addCalendar = async (params: API.Calendar.AddCalendar.Params) => {
  await http.post<any, any>('addCalendar', params)
}

// 编辑日历 -- finish
export const editCalendar = async (
  params: API.Calendar.AddCalendar.Params,
  id: number,
) => {
  await http.put<any, any>(`/b/calendar/${id}`, params)
}

// 删除日历 -- finish
export const deleteCalendar = async (params: { id: number }) => {
  await http.delete<any, any>(`/b/calendar/${params.id}`)
}

// 获取日历详情  -- finish
export const getCalendarInfo = async (params: { id: number | undefined }) => {
  const response = await http.get<any, API.Calendar.CalendarInfo.Result>(
    `/b/calendar/${params.id}`,
  )

  return response.data
}

// 用户日历设置  -- finish-1
export const userSetupsCalendar = async (
  params: API.Calendar.UserSetupsCalendar.Params,
) => {
  await http.post<any, any>(`/b/calendar/${params.id}/userSetups`, {
    is_check: params.is_check,
    color: params.color,
    is_only_show: params.is_only_show,
  })
}

// 订阅日历-- finish-1
export const subscribeCalendar = async (params: { id: number }) => {
  await http.post<any, any>(`/b/calendar/${params.id}/subscribe`)
}

// 获取日历月列表
export const getDaysOfMonthList = async (
  params: API.Calendar.GetDaysOfMonthList.Params,
) => {
  const res = await http.post<any, API.Calendar.GetDaysOfMonthList.Result>(
    urls.getDaysOfMonthList,
    params,
  )
  return res
}

// 获取日历周列表
export const getDaysOfWeekList = async (
  params: API.Calendar.GetDaysOfWeekList.Params,
) => {
  const res = await http.post<any, API.Calendar.GetDaysOfWeekList.Result>(
    urls.getDaysOfWeekList,
    params,
  )
  return res
}

// 取消订阅日历-- finish-1
export const unsubscribeCalendar = async (params: { id: number }) => {
  await http.post<any, any>(`/b/calendar/${params.id}/unsubscribe`)
}

// 获取日历设置接口  -- finish-1
export const getCalendarConfig = async () => {
  const response = await http.get<any, API.Calendar.GetCalendarConfig.Result>(
    'getCalendarConfig',
  )
  return {
    view_options: response.data.view_options,
    schedule_configs: response.data.schedule_configs,
    notification_configs: response.data.notification_configs,
  }
}

// 修改日历设置  -- finish -1
export const updateCalendarConfig = async (
  params: Model.Calendar.UpdateCalendarConfigParams,
) => {
  const response = await http.patch<any, API.Calendar.GetCalendarConfig.Result>(
    'updateCalendarConfig',
    params,
  )
  return {
    view_options: response.data.view_options,
    schedule_configs: response.data.schedule_configs,
    notification_configs: response.data.notification_configs,
  }
}
