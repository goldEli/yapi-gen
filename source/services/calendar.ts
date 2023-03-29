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
