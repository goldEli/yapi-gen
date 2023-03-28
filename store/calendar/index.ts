import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SliceState = {
  // 日历面板类型
  calendarPanelType: Model.Calendar.CalendarPanelType
}

const initialState: SliceState = {
  calendarPanelType: 'day',
  // 默认日程时长
}

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCalendarPanelType(
      state,
      action: PayloadAction<SliceState['calendarPanelType']>,
    ) {
      console.log(action.payload)
      state.calendarPanelType = action.payload
    },
  },
})

const calendar = slice.reducer

export const { setCalendarPanelType } = slice.actions

export default calendar
