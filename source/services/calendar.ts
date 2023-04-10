import * as http from '@/tools/http'

// 日历列表 我管理的、我订阅的
export const getCalendarList = async () => {
  return {
    code: '',
    msg: '',
    data: {
      manage: [
        {
          id: 1,
          color: 0,
          is_default: 1,
          name: '工作日历',
          is_check: 1,
        },
        {
          id: 2,
          color: 1,
          is_default: 0,
          name: '团队日历',
          is_check: 0,
        },
      ] as Model.Calendar.Info[],
      sub: [
        {
          id: 1,
          color: 2,
          is_default: 1,
          name: '哈哈哈日历',
          is_check: 0,
        },
        {
          id: 2,
          color: 3,
          is_default: 0,
          name: '啦啦啦日历',
          is_check: 1,
        },
      ] as Model.Calendar.Info[],
    },
  }
  const response = await http.get<any, API.Calendar.GetCalendarList.Result>(
    'getCalendarList',
  )
  return response
}

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
    'getSubscribeList',
  )
  return response
}

// 日历系统图标
export const getCalendarIconList = async () => {
  return {
    code: '',
    msg: '',
    data: {
      list: [
        {
          id: 1,
          path: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/22669459/prod/undefined/richEditorFiles_1679911209757/image.png',
        },
        {
          id: 2,
          path: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/22669459/prod/logoFullName.png/file/logoFullName.png',
        },
        {
          id: 3,
          path: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/22669459/prod/nature_10-032.jpg/file/nature_10-032.jpg',
        },
      ],
    },
  }
  const response = await http.get<any, API.Calendar.GetCalendarIconList.Result>(
    'getCalendarIconList',
  )
  return response
}

// 获取日历相关配置下拉
export const getRelateConfig = async () => {
  const response = await http.get<any, API.Calendar.GetRelateConfig.Result>(
    'getRelateConfig',
  )
  return response
}

// 创建日历
export const addCalendar = async (params: API.Calendar.AddCalendar.Params) => {
  await http.post<any, API.Calendar.GetRelateConfig.Result>(
    'addCalendar',
    params,
  )
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
