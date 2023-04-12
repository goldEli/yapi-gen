import urls from '@/constants/urls'
import * as http from '@/tools/http'

// 订阅日历列表
export const getSubscribeList = async (
  params: API.Calendar.GetSubscribeList.Params,
) => {
  const subList = [
    {
      id: 1,
      name: '日历名称',
      phone: '121212121',
      email: 'hjkhksdhds@.com',
      is_subscribe: 1,
      department: '产品部-产品',
    },
    {
      id: 2,
      name: '日历名称1111',
      phone: '121212121',
      email: 'hjkhksdhds@.com',
      is_subscribe: 0,
      department: '产品部-产品',
    },
  ] as Model.Calendar.SubscribeInfo[]
  const publicList = [
    {
      id: 1,
      name: '日历名称',
      is_subscribe: 1,
      creator: '张三',
      number: 1000,
      describe:
        '假数据啥啥假数据啥啥假数据啥啥假数据啥啥假数据啥啥假数据啥啥假数据啥啥假数据啥啥假数据啥啥假数据啥啥假数据啥啥',
      icon: 'dfdf',
    },
    {
      id: 2,
      name: '日历名称121212',
      is_subscribe: 0,
      creator: '张三',
      number: 1000,
      describe: '假数据啥啥',
      icon: 'dfdf',
    },
    {
      id: 3,
      name: '日历名称121212',
      is_subscribe: 0,
      creator: '张三',
      number: 1000,
      describe: '假数据啥啥',
      icon: 'dfdf',
    },
    {
      id: 4,
      name: '日历名称121212',
      is_subscribe: 0,
      creator: '张三',
      number: 1000,
      describe: '假数据啥啥',
      icon: 'dfdf',
    },
    {
      id: 5,
      name: '日历名称121212',
      is_subscribe: 0,
      creator: '张三',
      number: 1000,
      describe: '假数据啥啥',
      icon: 'dfdf',
    },
    {
      id: 6,
      name: '日历名称121212',
      is_subscribe: 0,
      creator: '张三',
      number: 1000,
      describe: '假数据啥啥',
      icon: 'dfdf',
    },
    {
      id: 7,
      name: '日历名称121212',
      is_subscribe: 0,
      creator: '张三',
      number: 1000,
      describe: '假数据啥啥',
      icon: 'dfdf',
    },
    {
      id: 8,
      name: '日历名称121212',
      is_subscribe: 0,
      creator: '张三',
      number: 1000,
      describe: '假数据啥啥',
      icon: 'dfdf',
    },
  ] as Model.Calendar.SubscribeInfo[]
  return {
    code: '',
    msg: '',
    data: {
      list: params.type === '0' ? subList : publicList,
    },
  }
  const response = await http.get<any, API.Calendar.GetSubscribeList.Result>(
    `/b/calendar/{params.type}/getAllCalendarList`,
  )
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

// 订阅日历
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

// 取消订阅日历
export const unsubscribeCalendar = async (params: { id: number }) => {
  await http.post<any, any>(`/b/calendar/${params.id}/unsubscribe`)
}

// 获取日历设置接口
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

// 修改日历设置
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
