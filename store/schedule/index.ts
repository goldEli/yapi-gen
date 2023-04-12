import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  getCalendarDaysOfYearList,
  getScheduleList,
  getCalendarDaysOfMonthList,
  getScheduleInfo
} from './schedule.thunk'

type SliceState = {
  // 默认日程时长
  defaultScheduleDuration: number
  // 最小日程时长
  minScheduleDuration: number
  // 日程列表
  scheduleList: {
    [key in string]: Model.Schedule.Info[]
  }
  scheduleListModal: Model.Schedule.ScheduleList
  scheduleDate?: number
  yearViewScheduleList: Model.Schedule.Info[]
  monthViewScheduleList: Model.Schedule.Info[],
  scheduleInfo: Model.Schedule.Info,
}

const initialState: SliceState = {
  // 默认日程时长
  defaultScheduleDuration: 30,
  // 最小日程时长
  minScheduleDuration: 15,
  scheduleList: {},
  //日程弹窗
  scheduleListModal: {
    visible: false,
    top: 0,
    left: 20,
  },
  scheduleDate: 0,
  yearViewScheduleList: [],
  monthViewScheduleList: [],
  scheduleInfo: {
    schedule_id: 0,
    subject: '',
    is_span_day: false,
    is_all_day: 1,
    start_timestamp: 0,
    end_timestamp: 0,
    is_busy: 1,
    color: 0,
    is_busy_text: '',
    year: 0,
    month: 0,
    day: 0,
    datetime:'', 
    timestamp:0
  }
}

const slice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    // setSchedule(state, action: PayloadAction<Model.Schedule.Info>) {
    //   state.scheduleList = state.scheduleList.map(item => {
    //     if (action.payload.id === item.id) {
    //       return action.payload
    //     }
    //     return item
    //   })
    // },
    setScheduleListModal(
      state,
      action: PayloadAction<Model.Schedule.ScheduleList>,
    ) {
      state.scheduleListModal = {
        ...state.scheduleListModal,
        ...action.payload,
      }
    },
    setScheduleDate(state, action: PayloadAction<number>) {
      state.scheduleDate = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getScheduleList.fulfilled, (state, action) => {
      state.scheduleList = action.payload
    })
    builder.addCase(getCalendarDaysOfYearList.fulfilled, (state, action) => {
      state.yearViewScheduleList = action.payload
    })
    builder.addCase(getCalendarDaysOfMonthList.fulfilled, (state, action) => {
      state.monthViewScheduleList = action.payload
    })
    builder.addCase(getScheduleInfo.fulfilled, (state, action) => {
      console.log('11111getScheduleInfo-----', action.payload)
      state.scheduleInfo = action.payload
    })
  },
})

const schedule = slice.reducer

export const { setScheduleListModal, setScheduleDate } = slice.actions

export default schedule
