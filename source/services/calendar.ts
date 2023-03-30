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
          color: '#6688FF',
          is_default: 1,
          name: '工作日历',
          is_check: 1,
        },
        {
          id: 2,
          color: '#43BA9A',
          is_default: 0,
          name: '团队日历',
          is_check: 0,
        },
      ] as Model.Calendar.Info[],
      sub: [
        {
          id: 1,
          color: '#6688FF',
          is_default: 1,
          name: '哈哈哈日历',
          is_check: 0,
        },
        {
          id: 2,
          color: '#43BA9A',
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
