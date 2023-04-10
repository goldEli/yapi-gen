import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
interface State {
  selectedDate: {
    startTime: number
    endTime: number
  }
  scheduleList: Model.Schedule.Info[]
  // date: number
  currentDate: number
}

const initialState: Partial<State> = {
  scheduleList: [
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
}

const slice = createSlice({
  name: 'createScheduleVisualization',
  initialState,
  reducers: {
    setSelectedDate(state, action: PayloadAction<State['selectedDate']>) {
      state.selectedDate = action.payload
      state.currentDate = action.payload.startTime
    },
    setToday(state) {
      state.currentDate = dayjs().valueOf()
    },
    onPrevDay(state) {
      state.currentDate = dayjs(state.currentDate).add(-1, 'day').valueOf()
    },
    onNextDay(state) {
      state.currentDate = dayjs(state.currentDate).add(1, 'day').valueOf()
    },
  },
})
const createScheduleVisualization = slice.reducer

export const { setToday, onPrevDay, onNextDay } = slice.actions

export default createScheduleVisualization
