import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs, { Dayjs } from 'dayjs'
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
    id: Model.Schedule.Info['schedule_id']
  }
  //日视图
  calenderDayValue: string
  //周视图
  calenderWeekValue: string
  //月视图
  calenderMonthValue: string
  //年视图
  calenderYearValue: string
  // 列表视图
  calenderListValue: string
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
  //搜索日程关键字
  scheduleSearchKey?: string
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
    id: 0,
  },
  calenderDayValue: dayjs().format('YYYY-M-D'),
  calenderWeekValue: dayjs().format('YYYY-M'),
  calenderMonthValue: dayjs().format('YYYY-M'),
  calenderYearValue: dayjs().format('YYYY'),
  calenderListValue: dayjs().format('YYYY-M-D'),
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
    resizeMonthSchedule(
      state,
      action: PayloadAction<SliceState['monthMoveScheduleActiveInfo']>,
    ) {
      // const all = store.getState()
      const newState = {
        ...state.monthMoveScheduleActiveInfo,
        ...action.payload,
      }
      const { startIndex = 0, endIndex = 0, length = 0 } = newState
      const len = length

      const min = endIndex ?? 0
      const max = startIndex + len
      console.log({ min, max })
      // 往前扩大天数时，往后拉的最大极限是不能小于最后一天
      if (min >= max) {
        return
      }

      const list = Array.from(Array(35).keys()).slice(min, max)
      state.monthMoveScheduleActiveInfo = {
        ...newState,
        visibleList: list,
      }
    },

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
      // state.scheduleInfoDropdown = {
      //   ...state.scheduleInfoDropdown,
      //   visible: false,
      // }
      // state.quickCreateScheduleModel = {
      //   ...state.quickCreateScheduleModel,
      //   ...action.payload,
      // }
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
    setCalenderDayValue(
      state,
      action: PayloadAction<SliceState['calenderDayValue']>,
    ) {
      state.calenderDayValue = action.payload
    },
    setCalenderWeekValue(
      state,
      action: PayloadAction<SliceState['calenderWeekValue']>,
    ) {
      console.log('payload-----', action.payload)
      state.calenderWeekValue = action.payload
    },
    setCalenderMonthValue(
      state,
      action: PayloadAction<SliceState['calenderMonthValue']>,
    ) {
      state.calenderMonthValue = action.payload
    },
    setCalenderYearValue(
      state,
      action: PayloadAction<SliceState['calenderYearValue']>,
    ) {
      state.calenderYearValue = action.payload
    },
    setCalenderListValue(
      state,
      action: PayloadAction<SliceState['calenderListValue']>,
    ) {
      //console.log('payload--',action.payload)
      state.calenderListValue = action.payload
    },
    setCalenderYearType(
      state,
      action: PayloadAction<SliceState['calenderYearType']>,
    ) {
      state.calenderYearType = action.payload
    },
    setScheduleSearchKey(state, action: PayloadAction<string>) {
      state.scheduleSearchKey = action.payload
    },
  },
})

const calendarPanel = slice.reducer

export const {
  setCalendarPanelType,
  setQuickCreateScheduleModel,
  setScheduleInfoDropdown,
  setCalenderDayValue,
  setCalenderWeekValue,
  setCalenderMonthValue,
  setCalenderYearValue,
  setCalenderYearType,
  setCalenderListValue,
  startMoveMonthSchedule,
  setScheduleSearchKey,
  clearMonthMoveScheduleActiveInfo,
  resizeMonthSchedule,
} = slice.actions

export default calendarPanel
