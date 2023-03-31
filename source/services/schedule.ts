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
          startTime: Date.parse('2023-3-26 4:00:00'),
          endTime: Date.parse('2023-3-26 5:00:00'),
          color: '#FF5C5E',
        },
        {
          id: 2,
          title: '做作业1',
          // startTime: Date.parse('2023-3-27 3:15:00'),
          // endTime: Date.parse('2023-3-27 4:45:00'),
          startTime: Date.parse('2023-3-27 5:45:00'),
          endTime: Date.parse('2023-3-27 7:00:00'),
          color: '#A176FB',
        },
        {
          id: 3,
          title: '睡觉',
          startTime: Date.parse('2023-3-27 1:15:00'),
          endTime: Date.parse('2023-3-27 1:45:00'),
          color: '#00D2C5',
        },
        {
          id: 4,
          title: '睡觉2',
          startTime: Date.parse('2023-3-28 1:30:00'),
          endTime: Date.parse('2023-3-28 2:00:00'),
          color: '#00D2C5',
        },
        {
          id: 5,
          title: '睡觉3',
          startTime: Date.parse('2023-3-29 1:45:00'),
          endTime: Date.parse('2023-3-29 2:30:00'),
          color: '#00D2C5',
        },
        {
          id: 6,
          title: '做作业2',
          startTime: Date.parse('2023-3-30 6:45:00'),
          endTime: Date.parse('2023-3-30 7:30:00'),
          color: '#00D2C5',
        },
        {
          id: 61,
          title: '做作业2',
          startTime: Date.parse('2023-3-31 6:45:00'),
          endTime: Date.parse('2023-3-31 7:30:00'),
          color: '#00D2C5',
        },
        {
          id: 62,
          title: '做作业2',
          startTime: Date.parse('2023-4-1 6:45:00'),
          endTime: Date.parse('2023-4-1 7:30:00'),
          color: '#00D2C5',
        },
        {
          id: 7,
          title: '这是一个全天任务',
          startTime: Date.parse('2023-3-27 6:45:00'),
          endTime: Date.parse('2023-3-27 7:30:00'),
          color: '#00D2C5',
          is_all_day: 1,
        },
        {
          id: 8,
          title: '这是一个全天任务',
          startTime: Date.parse('2023-3-27 6:45:00'),
          endTime: Date.parse('2023-3-27 7:30:00'),
          color: '#00D2C5',
          is_all_day: 1,
        },
        {
          id: 9,
          title: '这是一个全天任务',
          startTime: Date.parse('2023-3-27 6:45:00'),
          endTime: Date.parse('2023-3-27 7:30:00'),
          color: '#00D2C5',
          is_all_day: 1,
        },
        {
          id: 10,
          title: '这是一个全天任务',
          startTime: Date.parse('2023-3-27 6:45:00'),
          endTime: Date.parse('2023-3-27 7:30:00'),
          color: '#00D2C5',
          is_all_day: 1,
        },
        {
          id: 11,
          title: '这是一个全天任务',
          startTime: Date.parse('2023-3-27 6:45:00'),
          endTime: Date.parse('2023-3-27 7:30:00'),
          color: '#00D2C5',
          is_all_day: 1,
        },
        {
          id: 12,
          title: '这是一个全天任务',
          startTime: Date.parse('2023-3-27 6:45:00'),
          endTime: Date.parse('2023-3-27 7:30:00'),
          color: '#00D2C5',
          is_all_day: 1,
        },
      ] as Model.Schedule.Info[],
    },
  }
  const response = await http.get<any, API.Schedule.GetScheduleList.Result>(
    'getScheduleList',
    params,
  )
  return response
}
