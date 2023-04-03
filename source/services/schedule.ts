import * as http from '@/tools/http'

// 日程列表
export const getScheduleList = async (
  params: API.Schedule.GetScheduleList.Params,
) => {
  const res = {
    code: '',
    msg: '',
    data: {
      '2023-03-30': [
        {
          schedule_id: 26,
          subject: '这是一个跨天日程',
          is_span_day: true,
          is_all_day: 2,
          start_datetime: '2023-03-02 16:33:00',
          start_time: '16:33',
          start_timestamp: 1677745980,
          end_datetime: '2023-03-02 17:44:00',
          end_time: '17:44',
          end_timestamp: 1677750240,
          is_busy: 1,
          color: 3,
          is_busy_text: '忙碌',
          year: 2023,
          month: 3,
          day: 2,
          datetime: '2023-03-02',
          timestamp: 1677772799,
          first_start_date: '2023-03-02',
          first_start_datetime: '2023-03-03 16:33:00',
          first_start_timestamp: 1677745980,
        },
        {
          schedule_id: 27,
          subject: '这是一个全天日程',
          is_span_day: false,
          is_all_day: 1,
          start_datetime: '2023-03-03 16:33:00',
          start_time: '16:33',
          start_timestamp: 1677832380,
          end_datetime: '2023-03-03 17:44:00',
          end_time: '17:44',
          end_timestamp: 1677836640,
          is_busy: 1,
          color: 4,
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
        {
          schedule_id: 28,
          subject: '吃饭',
          is_span_day: false,
          is_all_day: 2,
          start_datetime: '2023-03-03 16:33:00',
          start_time: '16:33',
          start_timestamp: 1677832380,
          end_datetime: '2023-03-03 17:44:00',
          end_time: '17:44',
          end_timestamp: 1677836640,
          is_busy: 1,
          color: 5,
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
      '2023-03-31': [
        {
          schedule_id: 26,
          subject: '先入南事持参需',
          is_span_day: true,
          is_all_day: 2,
          start_datetime: '2023-03-02 16:33:00',
          start_time: '16:33',
          start_timestamp: 1677745980,
          end_datetime: '2023-03-03 17:44:00',
          end_time: '17:44',
          end_timestamp: 1677750240,
          is_busy: 1,
          color: 0,
          is_busy_text: '忙碌',
          year: 2023,
          month: 3,
          day: 3,
          datetime: '2023-03-02',
          timestamp: 1677772799,
          first_start_date: '2023-03-02',
          first_start_datetime: '2023-03-02 16:33:00',
          first_start_timestamp: 1677745980,
        },
        {
          schedule_id: 27,
          subject: '先入南事持参需',
          is_span_day: false,
          is_all_day: 2,
          start_datetime: '2023-03-03 16:33:00',
          start_time: '16:33',
          start_timestamp: 1677832380,
          end_datetime: '2023-03-03 17:44:00',
          end_time: '17:44',
          end_timestamp: 1677836640,
          is_busy: 1,
          color: 0,
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
  return res
  const response = await http.get<any, API.Schedule.GetScheduleList.Result>(
    'getScheduleList',
    params,
  )
  return response
}

export const saveScheduleList = async (
  params: API.Schedule.SaveSchedule.Params,
) => {
  const response = await http.get<any, API.Schedule.SaveSchedule.Result>(
    'SaveSchedule',
    params,
  )
  return response
}
