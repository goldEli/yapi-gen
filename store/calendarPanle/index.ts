import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

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
  },
  calenderYearValue:number,
  calenderYearType: Model.Calendar.CalendarYearType,
}

const initialState: SliceState = {
  calendarPanelType: 'week',
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
  calenderYearValue:dayjs().year(),
  calenderYearType:0
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
    setCalenderYearValue(state,action:PayloadAction<SliceState['calenderYearValue']>){
      state.calenderYearValue=action.payload
    },
    setCalenderYearType(state,action:PayloadAction<SliceState['calenderYearType']>){
      state.calenderYearType=action.payload
    }
  },
})

const calendarPanel = slice.reducer

export const {
  setCalendarPanelType,
  setQuickCreateScheduleModel,
  setScheduleInfoDropdown,
  setCalenderYearValue,
  setCalenderYearType
} = slice.actions

export default calendarPanel
