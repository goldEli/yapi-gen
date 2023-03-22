import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SliceState = {
  // 日历面板类型
  calendarPanelType: Model.Calendar.CalendarPanelType
  // 默认日程时长
  defaultScheduleDuration: number
  // 最小日程时长
  minScheduleDuration: number
}

const initialState: SliceState = {
  calendarPanelType: 'day',
  // 默认日程时长
  defaultScheduleDuration: 30,
  // 最小日程时长
  minScheduleDuration: 15,
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
