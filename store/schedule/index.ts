import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  getCalendarDaysOfYearList,
  getCalendarDaysOfMonthList,
  getScheduleInfo,
  getScheduleListDaysOfDate,
  getScheduleListDaysOfWeek,
  getScheduleListDaysOfMonth,
  getScheduleSearch,
  getLeftCalendarDaysOfMonthList,
  getScheduleDaysOfList,
} from './schedule.thunk'
import { mapToArray } from '@/tools'
import dayjs from 'dayjs'
interface a {
  date: number | string
  list: Model.Schedule.Info[]
}
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
    [key in string]: Model.Schedule.ScheduleListInfo[]
  }
  listViewScheduleList?: Model.Schedule.listViewScheduleListProps[]
  monthViewScheduleList: []
  scheduleInfo?: Model.Schedule.DetailInfo
  scheduleInfoReply?: {
    status: number
  }
  // scheduleInfoDeleteStatus?: {}
  // scheduleInfoTransferStatus?: {}
  leftViewScheduleList: {
    [key in string]: Model.Schedule.Info[]
  }
  // 创建日程右侧可视化
  visualizationTime?: {
    startTime?: string
    endTime?: string
  }
  showScheduleInfoTip?: boolean
  isAddOrDelete?: boolean
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
    setVisualizationTime(
      state,
      action: PayloadAction<SliceState['visualizationTime']>,
    ) {
      state.visualizationTime = action.payload
    },
    setScheduleInfo(state, action: PayloadAction<SliceState['scheduleInfo']>) {
      state.scheduleInfo = action.payload
    },
    setYearViewsList(
      state,
      action: PayloadAction<SliceState['yearViewScheduleList']>,
    ) {
      state.yearViewScheduleList = action.payload
    },
    clearScheduleList(state) {
      state.scheduleList = {}
      state.listViewScheduleList = []
      state.yearViewScheduleList = {}
    },
    setScheduleList(state, action: PayloadAction<SliceState['scheduleList']>) {
      state.scheduleList = action.payload
    },
    setListViews(
      state,
      action: PayloadAction<SliceState['listViewScheduleList']>,
    ) {
      state.listViewScheduleList = action.payload
    },
    setShowScheduleInfoTip(state, action: PayloadAction<boolean>) {
      state.showScheduleInfoTip = action.payload
    },
    setIsAddOrDelete(state, action: PayloadAction<boolean>) {
      state.isAddOrDelete = action.payload
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
      let array: Model.Schedule.listViewScheduleListProps[] = []
      if (action.payload) {
        array = mapToArray(action.payload)
        state.listViewScheduleList = [...array]
      }
    })
    builder.addCase(getScheduleInfo.fulfilled, (state, action) => {
      state.scheduleInfo = action.payload
    })
    builder.addCase(
      getLeftCalendarDaysOfMonthList.fulfilled,
      (state, action) => {
        state.leftViewScheduleList = action.payload
      },
    )
    builder.addCase(getScheduleSearch.fulfilled, (state, action) => {
      let array: Model.Schedule.listViewScheduleListProps[] = []
      if (action.payload) {
        Object.keys(action.payload)
          .sort()
          .forEach(key => {
            array.push({ date: key, list: action.payload[key] })
          })
      }
      state.listViewScheduleList = array
    })
  },
})

const schedule = slice.reducer

export const {
  setScheduleListModal,
  setScheduleDate,
  setVisualizationTime,
  setScheduleInfo,
  setYearViewsList,
  setScheduleList,
  setListViews,
  clearScheduleList,
  setShowScheduleInfoTip,
  setIsAddOrDelete,
} = slice.actions

export default schedule
