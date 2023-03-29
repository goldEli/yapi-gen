import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getCalendarList } from './calendar.thunk'

type SliceState = {
  // 日历面板类型
  calendarPanelType: Model.Calendar.CalendarPanelType
  // 左侧-日历列表
  calendarData: Model.Calendar.CalendarData
  // 左侧-日历列表-选中的日历
  checkedCalendarList: Model.Calendar.Info[]
}

const initialState: SliceState = {
  calendarPanelType: 'day',
  calendarData: {
    manage: [],
    sub: [],
  },
  checkedCalendarList: [],
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
    setCalendarData(state, action: PayloadAction<SliceState['calendarData']>) {
      state.calendarData = action.payload
    },
    setCheckedCalendarList(
      state,
      action: PayloadAction<SliceState['checkedCalendarList']>,
    ) {
      state.checkedCalendarList = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getCalendarList.fulfilled, (state, action) => {
      state.calendarData = action.payload
      const checkManageList = action.payload.manage?.filter(
        (i: Model.Calendar.Info) => i.is_check,
      )
      const checkSubList = action.payload.sub?.filter(
        (i: Model.Calendar.Info) => i.is_check,
      )
      // 获取当前数据默认选择的日历
      state.checkedCalendarList = [...checkManageList, ...checkSubList]
    })
  },
})

const calendar = slice.reducer

export const { setCalendarPanelType, setCheckedCalendarList, setCalendarData } =
  slice.actions

export default calendar
