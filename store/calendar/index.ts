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
  // 是否打开创建或者是编辑日程弹窗
  isShowScheduleVisible: boolean
  showScheduleParams: Model.Calendar.ShowScheduleParams
  partialDayTimeOption: { label: string; value: number }[]
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
  isShowScheduleVisible: false,
  showScheduleParams: {},
  partialDayTimeOption: [
    { label: '日程开始时', value: 0 },
    { label: '提前5分钟', value: 1 },
    { label: '提前15分钟', value: 2 },
    { label: '提前30分钟', value: 3 },
    { label: '提前1小时', value: 4 },
    { label: '提前2小时', value: 5 },
    { label: '提前3小时', value: 6 },
    { label: '提前1天', value: 7 },
    { label: '提前2天', value: 8 },
    { label: '提前1周', value: 9 },
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
    setIsShowScheduleVisible(
      state,
      action: PayloadAction<SliceState['isShowScheduleVisible']>,
    ) {
      state.isShowScheduleVisible = action.payload
    },
    setShowScheduleParams(
      state,
      action: PayloadAction<SliceState['showScheduleParams']>,
    ) {
      state.showScheduleParams = action.payload
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

export const {
  setCheckedCalendarList,
  setCalendarData,
  setRouterMenu,
  setIsShowScheduleVisible,
  setShowScheduleParams,
} = slice.actions

export default calendar
