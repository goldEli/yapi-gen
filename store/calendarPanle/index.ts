import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
}

const initialState: SliceState = {
  calendarPanelType: 'day',
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
}

const slice = createSlice({
  name: 'calendarPanel',
  initialState,
  reducers: {
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
  },
})

const calendarPanel = slice.reducer

export const {
  setCalendarPanelType,
  setQuickCreateScheduleModel,
  setScheduleInfoDropdown,
} = slice.actions

export default calendarPanel
