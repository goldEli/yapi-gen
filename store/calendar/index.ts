import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { getCalendarList } from './calendar.thunk'

type SliceState = {
  // 左侧-日历列表
  calendarData: Model.Calendar.CalendarData
  // 左侧-日历列表-选中的日历
  checkedCalendarList: Model.Calendar.Info[]
  // 日历路由记录
  routerMenu: Model.Calendar.RouterMenu
  menuList: Model.Calendar.RouterMenu[]
  // 选择的日期
  selectedDay: number
  // 选择的周
  selectedWeek: {
    date: number
  }[]
}

const initialState: SliceState = {
  calendarData: {
    manage: [],
    sub: [],
  },
  checkedCalendarList: [],
  menuList: [
    { name: '视图选项', key: 'view' },
    { name: '日程设置', key: 'schedule' },
    { name: '通知设置', key: 'notice' },
    { name: '日历导入', key: 'import' },
    { name: '日历导出', key: 'export' },
  ],
  routerMenu: {
    name: '',
    key: '',
  },
  selectedDay: dayjs('2023-3-30 13:10:00').valueOf(),
  selectedWeek: [
    {
      date: dayjs('2023-3-26 00:00:00').valueOf(),
    },
    {
      date: dayjs('2023-3-27 00:00:00').valueOf(),
    },
    {
      date: dayjs('2023-3-28 00:00:00').valueOf(),
    },
    {
      date: dayjs('2023-3-29 00:00:00').valueOf(),
    },
    {
      date: dayjs('2023-3-30 00:00:00').valueOf(),
    },
    {
      date: dayjs('2023-3-31 00:00:00').valueOf(),
    },
    {
      date: dayjs('2023-4-1 00:00:00').valueOf(),
    },
  ],
}

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCalendarData(state, action: PayloadAction<SliceState['calendarData']>) {
      state.calendarData = action.payload
    },
    setCheckedCalendarList(
      state,
      action: PayloadAction<SliceState['checkedCalendarList']>,
    ) {
      state.checkedCalendarList = action.payload
    },
    setRouterMenu(state, action: PayloadAction<SliceState['routerMenu']>) {
      state.routerMenu = action.payload
    },
    setSelectedDay(state, action: PayloadAction<SliceState['selectedDay']>) {
      state.selectedDay = action.payload
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

export const { setCheckedCalendarList, setCalendarData, setRouterMenu } =
  slice.actions

export default calendar
