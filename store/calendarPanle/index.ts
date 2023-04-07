import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { store } from '..'

type SliceState = {
  // 日历面板类型
  calendarPanelType: Model.Calendar.CalendarPanelType
  // 快速创建日程弹窗
  quickCreateScheduleModel: {
    visible: boolean
    x: number
    y: number
  }
  // 查看日程详情弹窗
  scheduleInfoDropdown: {
    visible: boolean
    x: number
    y: number
  }
  calenderYearValue: number
  calenderYearType: Model.Calendar.CalendarYearType
  // 月视图拖拽日程时，控制显示
  monthMoveScheduleActiveInfo: {
    startSchedule?: Model.Schedule.Info
    startIndex?: number
    endIndex?: number
    visibleList?: number[]
    // 包含几个日程
    length?: number
  }
}
const defaultMonthMoveScheduleActiveInfo = {
  visibleList: [],
}

const initialState: SliceState = {
  calendarPanelType: 'month',
  quickCreateScheduleModel: {
    visible: false,
    x: 0,
    y: 0,
  },
  scheduleInfoDropdown: {
    visible: false,
    x: 0,
    y: 0,
  },
  calenderYearValue: dayjs().year(),
  calenderYearType: 0,
  monthMoveScheduleActiveInfo: defaultMonthMoveScheduleActiveInfo,
}

const slice = createSlice({
  name: 'calendarPanel',
  initialState,
  reducers: {
    clearMonthMoveScheduleActiveInfo(state) {
      state.monthMoveScheduleActiveInfo = defaultMonthMoveScheduleActiveInfo
    },
    startMoveMonthSchedule(
      state,
      action: PayloadAction<SliceState['monthMoveScheduleActiveInfo']>,
    ) {
      // const all = store.getState()

      const newState = {
        ...state.monthMoveScheduleActiveInfo,
        ...action.payload,
      }
      const len = newState?.length ?? 0

      const min = newState.endIndex ?? 0
      const max = min + len

      const list = Array.from(Array(35).keys()).slice(min, max)
      state.monthMoveScheduleActiveInfo = {
        ...newState,
        visibleList: list,
      }
    },
    // moveMonthSchedule(
    //   state,
    //   action: PayloadAction<SliceState['monthMoveScheduleActiveInfo']>,
    // ) {
    //   if (!state.monthMoveScheduleActiveInfo.visibleList?.length) {
    //     return
    //   }
    //   const newState = {
    //     ...state.monthMoveScheduleActiveInfo,
    //     ...action.payload,
    //   }
    //   // const { scheduleList } = all.schedule
    //   const { startIndex, endIndex } = newState
    //   if (startIndex === void 0) {
    //     return
    //   }
    //   if (endIndex === void 0) {
    //     return
    //   }
    //   const len = newState.length ?? 0

    //   const min = newState.endIndex ?? 0
    //   const max = min + len

    //   const list = Array.from(Array(35).keys()).slice(min, max)
    //   state.monthMoveScheduleActiveInfo = {
    //     ...newState,
    //     visibleList: list,
    //   }
    // },
    setCalendarPanelType(
      state,
      action: PayloadAction<SliceState['calendarPanelType']>,
    ) {
      console.log(action.payload)
      state.calendarPanelType = action.payload
    },
    setQuickCreateScheduleModel(
      state,
      action: PayloadAction<Partial<SliceState['quickCreateScheduleModel']>>,
    ) {
      state.scheduleInfoDropdown = {
        ...state.scheduleInfoDropdown,
        visible: false,
      }
      state.quickCreateScheduleModel = {
        ...state.quickCreateScheduleModel,
        ...action.payload,
      }
    },
    setScheduleInfoDropdown(
      state,
      action: PayloadAction<Partial<SliceState['scheduleInfoDropdown']>>,
    ) {
      state.quickCreateScheduleModel = {
        ...state.quickCreateScheduleModel,
        visible: false,
      }
      state.scheduleInfoDropdown = {
        ...state.scheduleInfoDropdown,
        ...action.payload,
      }
    },
    setCalenderYearValue(
      state,
      action: PayloadAction<SliceState['calenderYearValue']>,
    ) {
      state.calenderYearValue = action.payload
    },
    setCalenderYearType(
      state,
      action: PayloadAction<SliceState['calenderYearType']>,
    ) {
      state.calenderYearType = action.payload
    },
  },
})

const calendarPanel = slice.reducer

export const {
  setCalendarPanelType,
  setQuickCreateScheduleModel,
  setScheduleInfoDropdown,
  setCalenderYearValue,
  setCalenderYearType,
  startMoveMonthSchedule,
  clearMonthMoveScheduleActiveInfo,
  // moveMonthSchedule,
} = slice.actions

export default calendarPanel
