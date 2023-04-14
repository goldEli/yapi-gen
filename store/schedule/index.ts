import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  getCalendarDaysOfYearList,
  getCalendarDaysOfMonthList,
  getScheduleInfo,
  getScheduleListDaysOfDate,
  getScheduleListDaysOfWeek,
  getScheduleListDaysOfMonth,
  scheduleInfoReply,
  scheduleInfoDelete,
  scheduleInfoTransfer,
  getScheduleSearch,
  getLeftCalendarDaysOfMonthList,
  getScheduleDaysOfList,
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
  yearViewScheduleList: {
    [key in string]: Model.Schedule.Info[]
  }
  listViewScheduleList?: []
  monthViewScheduleList: Model.Schedule.Info[]
  scheduleInfo?: Model.Schedule.DetailInfo
  scheduleInfoReply?: {
    status: number
  }
  // scheduleInfoDeleteStatus?: {}
  // scheduleInfoTransferStatus?: {}
  leftViewScheduleList: {
    [key in string]: Model.Schedule.Info[]
  }
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
  yearViewScheduleList: {},
  monthViewScheduleList: [],
  leftViewScheduleList: {},
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
    setScheduleInfoDelete(state, action: PayloadAction<string>) {
     // state.scheduleInfoDeleteStatus = action.payload
    },
    setScheduleInfoTransfer(state, action: PayloadAction<string>) {
     // state.scheduleInfoTransferStatus = action.payload
    },
  },
  extraReducers(builder) {
    // builder.addCase(getScheduleList.fulfilled, (state, action) => {
    //   state.scheduleList = action.payload
    // })
    builder.addCase(getScheduleListDaysOfDate.fulfilled, (state, action) => {
      state.scheduleList = action.payload
    })
    builder.addCase(getScheduleListDaysOfWeek.fulfilled, (state, action) => {
      state.scheduleList = action.payload
    })
    builder.addCase(getScheduleListDaysOfMonth.fulfilled, (state, action) => {
      state.scheduleList = action.payload
    })
    builder.addCase(getCalendarDaysOfYearList.fulfilled, (state, action) => {
      state.yearViewScheduleList = action.payload
    })
    builder.addCase(getCalendarDaysOfMonthList.fulfilled, (state, action) => {
      state.monthViewScheduleList = action.payload
    })
    builder.addCase(getScheduleDaysOfList.fulfilled, (state, action) => {
      let array: any = []
      if (action.payload) {
        Object.keys(action.payload)
          .sort()
          .forEach(key => {
            array.push({ date: key, list: action.payload[key] })
          })
      }
      state.listViewScheduleList = array
    })
    builder.addCase(getScheduleInfo.fulfilled, (state, action) => {
      state.scheduleInfo = action.payload
    })
    builder.addCase(scheduleInfoReply.fulfilled, (state, action) => {
      state.scheduleInfoReply = action.payload
    })
    builder.addCase(
      getLeftCalendarDaysOfMonthList.fulfilled,
      (state, action) => {
        state.leftViewScheduleList = action.payload
      },
    )
    builder.addCase(scheduleInfoDelete.fulfilled, (state, action) => {
     // state.scheduleInfoDeleteStatus = action.payload
    })
    builder.addCase(scheduleInfoTransfer.fulfilled, (state, action) => {
     // state.scheduleInfoTransferStatus = action.payload
    })
    builder.addCase(getScheduleSearch.fulfilled, (state, action) => {
      let array: any = []
      if (action.payload) {
        Object.keys(action.payload)
          .sort()
          .forEach(key => {
            array.push({ date: key, list: action.payload[key] })
          })
      }
      state.listViewScheduleList = array
      // state.leftViewScheduleList = action.payload
    })
  },
})

const schedule = slice.reducer

export const {
  setScheduleListModal,
  setScheduleDate,
  setScheduleInfoDelete,
  setScheduleInfoTransfer,
} = slice.actions

export default schedule
