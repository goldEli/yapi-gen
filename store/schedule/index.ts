import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getCalendarDaysOfYeaList, getScheduleList } from './schedule.thunk'
import dayjs, { Dayjs } from 'dayjs'

type SliceState = {
  // 默认日程时长
  defaultScheduleDuration: number
  // 最小日程时长
  minScheduleDuration: number
  // 日程列表
  scheduleList: {
    [key in string]: Model.Schedule.Info[]
  }
  scheduleListModal: {
    visible: boolean
    top: number
    left: number
  }
  scheduleDate?: number
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
    setScheduleListMoadl(
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
    builder.addCase(getCalendarDaysOfYeaList.fulfilled,(state,action)=>{
      console.log('action-----',action)
    })
  },
})

const schedule = slice.reducer

export const { setScheduleListMoadl, setScheduleDate} = slice.actions

export default schedule
