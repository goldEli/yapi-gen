import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SliceState = {
  // 日历面板类型
  calendarPanelType: Model.Calendar.CalendarPanelType
  list: Model.Calendar.Info[]
}

const initialState: SliceState = {
  calendarPanelType: 'day',
  list: [
    {
      id: 1,
      color: '#FA9746',
      is_default: 1,
    },
    {
      id: 2,
      color: '#6688FF',
      is_default: 0,
    },
  ],
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
