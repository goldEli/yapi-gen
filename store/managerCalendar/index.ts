import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SliceState = {
  // 日历面板类型
  calendarPanelType: Model.Calendar.CalendarPanelType
}

const initialState: SliceState = {
  calendarPanelType: 'day',
}

const slice = createSlice({
  name: 'managerCalendar',
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

const managerCalendar = slice.reducer

export const { setCalendarPanelType } = slice.actions

export default managerCalendar
