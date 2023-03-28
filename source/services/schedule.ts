import * as http from '@/tools/http'

// 日程列表
export const getScheduleList = async (
  params: API.Schedule.GetScheduleList.Params,
) => {
  return {
    code: '',
    msg: '',
    data: {
      list: [
        {
          id: 1,
          title: '吃早饭',
          startTime: Date.parse('2023-3-23 4:00:00'),
          endTime: Date.parse('2023-3-23 5:00:00'),
          color: '#FF5C5E',
        },
        {
          id: 2,
          title: '做作业',
          startTime: Date.parse('2023-3-23 3:15:00'),
          endTime: Date.parse('2023-3-23 4:45:00'),
          color: '#A176FB',
        },
        {
          id: 3,
          title: '睡觉',
          startTime: Date.parse('2023-3-23 1:15:00'),
          endTime: Date.parse('2023-3-23 1:30:00'),
          color: '#00D2C5',
        },
      ],
    },
  }
  const response = await http.get<any, API.Schedule.GetScheduleList.Result>(
    'getScheduleList',
    params,
  )
  return response
}
