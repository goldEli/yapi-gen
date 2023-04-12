import * as http from '@/tools/http'
import dayjs from 'dayjs'

// 日程列表
export const getScheduleList = async (
  params: API.Schedule.GetScheduleList.Params,
) => {
  const res = {
    code: '',
    msg: '',
    data: {
      '2023-03-29': [
        {
          schedule_id: 26,
          subject: '这是一个跨天日程',
          is_span_day: true,
          is_all_day: 2,
          start_datetime: '2023-03-29 16:33:00',
          start_time: '16:33',
          start_timestamp: dayjs('2023-03-29 16:33:00').valueOf(),
          end_datetime: '2023-03-29 17:44:00',
          end_time: '17:44',
          end_timestamp: dayjs('2023-03-29 17:44:00').valueOf(),
          is_busy: 1,
          color: 0,
          is_busy_text: '忙碌',
          year: 2023,
          month: 3,
          day: 2,
          datetime: '2023-03-02',
          timestamp: 1677772799,
          schedule_start_datetime: '2023-03-29 16:33:00',
        },
      ],
      '2023-03-30': [
        {
          schedule_id: 26,
          subject: '这是一个跨天日程',
          is_span_day: true,
          is_all_day: 2,
          start_datetime: '2023-03-30 16:33:00',
          start_time: '16:33',
          start_timestamp: dayjs('2023-03-30 16:33:00').valueOf(),
          end_datetime: '2023-03-30 17:44:00',
          end_time: '17:44',
          end_timestamp: dayjs('2023-03-30 17:44:00').valueOf(),
          is_busy: 1,
          color: 0,
          is_busy_text: '忙碌',
          year: 2023,
          month: 3,
          day: 2,
          datetime: '2023-03-02',
          timestamp: 1677772799,
          schedule_start_datetime: '2023-03-29 16:33:00',
        },
        {
          schedule_id: 32,
          subject: '这是一个全天日程2',
          is_span_day: false,
          is_all_day: 1,
          start_datetime: '2023-03-30 16:33:00',
          start_time: '16:33',
          start_timestamp: dayjs('2023-03-30 16:33:00').valueOf(),
          end_datetime: '2023-03-30 17:44:00',
          end_time: '17:44',
          end_timestamp: dayjs('2023-03-30 17:44:00').valueOf(),
          is_busy: 1,
          color: 4,
          is_busy_text: '忙碌',
          year: 2023,
          month: 3,
          day: 3,
          datetime: '2023-03-03',
          timestamp: 1677859199,
          first_start_date: '2023-03-30',
          first_start_datetime: '2023-03-02 16:33:00',
          first_start_timestamp: dayjs('2023-03-30').valueOf(),
        },
        {
          schedule_id: 31,
          subject: '这是一个全天日程1',
          is_span_day: false,
          is_all_day: 1,
          start_datetime: '2023-03-30 16:33:00',
          start_time: '16:33',
          start_timestamp: dayjs('2023-03-30 16:33:00').valueOf(),
          end_datetime: '2023-03-30 17:44:00',
          end_time: '17:44',
          end_timestamp: dayjs('2023-03-30 17:44:00').valueOf(),
          is_busy: 1,
          color: 4,
          is_busy_text: '忙碌',
          year: 2023,
          month: 3,
          day: 3,
          datetime: '2023-03-03',
          timestamp: 1677859199,
          first_start_date: '2023-03-30',
          first_start_datetime: '2023-03-02 16:33:00',
          first_start_timestamp: dayjs('2023-03-30').valueOf(),
        },
        {
          schedule_id: 27,
          subject: '这是一个全天日程',
          is_span_day: false,
          is_all_day: 1,
          start_datetime: '2023-03-30 16:33:00',
          start_time: '16:33',
          start_timestamp: dayjs('2023-03-30 16:33:00').valueOf(),
          end_datetime: '2023-03-30 17:44:00',
          end_time: '17:44',
          end_timestamp: dayjs('2023-03-30 17:44:00').valueOf(),
          is_busy: 1,
          color: 4,
          is_busy_text: '忙碌',
          year: 2023,
          month: 3,
          day: 3,
          datetime: '2023-03-03',
          timestamp: 1677859199,
          first_start_date: '2023-03-30',
          first_start_datetime: '2023-03-02 16:33:00',
          first_start_timestamp: dayjs('2023-03-30').valueOf(),
        },
        {
          schedule_id: 28,
          subject: '吃饭',
          is_span_day: false,
          is_all_day: 2,
          start_datetime: '2023-03-30 16:33:00',
          start_time: '16:33',
          start_timestamp: dayjs('2023-03-30 16:33:00').valueOf(),
          end_datetime: '2023-03-30 17:44:00',
          end_time: '17:44',
          end_timestamp: dayjs('2023-03-30 17:44:00').valueOf(),
          is_busy: 1,
          color: 5,
          is_busy_text: '忙碌',
          year: 2023,
          month: 3,
          day: 3,
          datetime: '2023-03-03',
          timestamp: 1677859199,
        },
        {
          schedule_id: 30,
          subject: '睡觉',
          is_span_day: false,
          is_all_day: 2,
          start_datetime: '2023-03-30 18:33:00',
          start_time: '18:33',
          start_timestamp: dayjs('2023-03-30 18:33:00').valueOf(),
          end_datetime: '2023-03-30 19:44:00',
          end_time: '19:44',
          end_timestamp: dayjs('2023-03-30 19:44:00').valueOf(),
          is_busy: 1,
          color: 5,
          is_busy_text: '忙碌',
          year: 2023,
          month: 3,
          day: 3,
          datetime: '2023-03-03',
          timestamp: 1677859199,
        },
      ],
      '2023-03-31': [
        {
          schedule_id: 26,
          subject: '这是一个跨天日程',
          is_span_day: true,
          is_all_day: 2,
          start_datetime: '2023-03-31 16:33:00',
          start_time: '16:33',
          start_timestamp: dayjs('2023-03-31 16:33:00').valueOf(),
          end_datetime: '2023-03-31 17:44:00',
          end_time: '17:44',
          end_timestamp: dayjs('2023-03-31 17:44:00').valueOf(),
          is_busy: 1,
          color: 0,
          is_busy_text: '忙碌',
          year: 2023,
          month: 3,
          day: 3,
          datetime: '2023-03-31',
          timestamp: 1677772799,
          schedule_start_datetime: '2023-03-29 16:33:00',
        },
        {
          schedule_id: 27,
          subject: '睡觉',
          is_span_day: false,
          is_all_day: 2,
          start_datetime: '2023-03-31 16:33:00',
          start_time: '16:33',
          start_timestamp: dayjs('2023-03-31 16:33:00').valueOf(),
          end_datetime: '2023-03-31 17:44:00',
          end_time: '17:44',
          end_timestamp: dayjs('2023-03-31 17:44:00').valueOf(),
          is_busy: 1,
          color: 0,
          is_busy_text: '忙碌',
          year: 2023,
          month: 3,
          day: 3,
          datetime: '2023-03-03',
          timestamp: 1677859199,
        },
        {
          schedule_id: 29,
          subject: '看电视',
          is_span_day: false,
          is_all_day: 2,
          start_datetime: '2023-03-31 16:33:00',
          start_time: '16:33',
          start_timestamp: dayjs('2023-03-31 1:33:00').valueOf(),
          end_datetime: '2023-03-31 17:44:00',
          end_time: '17:44',
          end_timestamp: dayjs('2023-03-31 2:44:00').valueOf(),
          is_busy: 1,
          color: 7,
          is_busy_text: '忙碌',
          year: 2023,
          month: 3,
          day: 3,
          datetime: '2023-03-03',
          timestamp: 1677859199,
          first_start_date: '2023-03-02',
          first_start_datetime: '2023-03-02 16:33:00',
          first_start_timestamp: 1677745980,
        },
      ],
      '2023-04-01': [
        {
          schedule_id: 26,
          subject: '这是一个跨天日程',
          is_span_day: true,
          is_all_day: 2,
          start_datetime: '2023-04-01 16:33:00',
          start_time: '16:33',
          start_timestamp: dayjs('2023-04-01 16:33:00').valueOf(),
          end_datetime: '2023-04-01 17:44:00',
          end_time: '17:44',
          end_timestamp: dayjs('2023-04-01 17:44:00').valueOf(),
          is_busy: 1,
          color: 0,
          is_busy_text: '忙碌',
          year: 2023,
          month: 3,
          day: 2,
          datetime: '2023-03-02',
          timestamp: 1677772799,
          schedule_start_datetime: '2023-03-29 16:33:00',
        },
        {
          schedule_id: 27,
          subject: '这是一个跨天日程',
          is_span_day: false,
          is_all_day: 2,
          start_datetime: '2023-04-01 16:33:00',
          start_time: '16:33',
          start_timestamp: dayjs('2023-04-01 16:33:00').valueOf(),
          end_datetime: '2023-04-01 17:44:00',
          end_time: '17:44',
          end_timestamp: dayjs('2023-04-01 17:44:00').valueOf(),
          is_busy: 1,
          color: 0,
          is_busy_text: '忙碌',
          year: 2023,
          month: 3,
          day: 2,
          datetime: '2023-03-02',
          timestamp: 1677772799,
          schedule_start_datetime: '2023-03-29 16:33:00',
        },
      ],
      '2023-04-02': [
        {
          schedule_id: 26,
          subject: '这是一个跨天日程',
          is_span_day: true,
          is_all_day: 2,
          start_datetime: '2023-04-02 16:33:00',
          start_time: '16:33',
          start_timestamp: dayjs('2023-04-02 16:33:00').valueOf(),
          end_datetime: '2023-04-02 17:44:00',
          end_time: '17:44',
          end_timestamp: dayjs('2023-04-02 17:44:00').valueOf(),
          is_busy: 1,
          color: 0,
          is_busy_text: '忙碌',
          year: 2023,
          month: 3,
          day: 2,
          datetime: '2023-03-02',
          timestamp: 1677772799,
          schedule_start_datetime: '2023-03-29 16:33:00',
        },
      ],
    } as API.Schedule.GetScheduleList.Result,
  }
  for (const key in res.data) {
    const item = res.data[key]
    item.forEach(i => {
      i.id = i.schedule_id + key
    })
  }
  // res.data = res.data.map(item => {
  //   return {
  //     ...item,
  //     id:
  //   }
  // }) as API.Schedule.GetScheduleList.Result
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

// 获取日程详情
export const getScheduleInfo = async (params: { id: number }) => {
  const response = await http.post<any, any>(`/b/schedule/${params.id}`)
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
