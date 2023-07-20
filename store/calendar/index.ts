/* eslint-disable max-lines */
/* eslint-disable no-undefined */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import {
  getCalendarConfig,
  getCalendarList,
  getDaysOfMonthList,
  getDaysOfWeekList,
  getRelateConfig,
  updateCalendarConfig,
} from './calendar.thunk'
import { store, AppDispatch } from '@store/index'
import { refreshCalendarPanelScheduleList } from '@store/schedule/schedule.thunk'
type SliceState = {
  // 左侧-选中的时间
  checkedTime: string
  relateConfig: Model.Calendar.GetRelateConfig
  // 日历设置配置
  calendarConfig: Model.Calendar.UpdateCalendarConfigParams
  // 左侧-日历列表
  calendarData: Model.Calendar.CalendarData
  // 左侧-日历列表-选中的日历
  checkedCalendarList: Model.Calendar.Info[]
  // 日历路由记录
  routerMenu: Model.Calendar.RouterMenu
  menuList: Model.Calendar.RouterMenu[]

  // 选择的周
  selectedWeek: Model.Calendar.DaysOfWeek[]
  // 是否打开创建或者是编辑日程弹窗
  scheduleModal: {
    visible: boolean
    params?: Model.Calendar.ShowScheduleParams
  }
  // 是否打开创建或者是编辑日历弹窗
  calendarModal: {
    visible: boolean
    params?: Model.Calendar.ShowCalendarParams
  }
  // 是否打开订阅日历弹窗
  subscribeModal: boolean
  // 选择的月信息
  selectedMonth?: Model.Calendar.DaysOfMonth[]
}

const initialState: SliceState = {
  checkedTime: dayjs().format('YYYY-MM-DD'),
  relateConfig: {
    calendar: {
      permission_types: [],
      user_group_ids: [],
      subscribe_types: [],
      calendar_types: [],
      icon_path: [],
    },
    schedule: {
      permission_types: [],
      repeat_types: [],
      repeat_end_types: [],
      remind_types: [],
      all_day_remind: [],
      un_all_day_remind: [],
      default_duration: [],
      busy_status: [],
    },
  },
  calendarConfig: {
    view_options: undefined,
    schedule_configs: undefined,
    notification_configs: undefined,
  },
  calendarData: {
    manager: [],
    subscribe: [],
  },
  checkedCalendarList: [],
  menuList: [
    { name: 'calendarManager.view_options', key: 'view' },
    { name: 'calendarManager.schedule_settings', key: 'schedule' },
    { name: 'calendarManager.notification_settings', key: 'notice' },
    // { name: 'calendarManager.calendar_import', key: 'import' },
    // { name: 'calendarManager.calendar_export', key: 'export' },
  ],
  routerMenu: {
    name: '',
    key: '',
  },
  selectedWeek: [],
  scheduleModal: {
    visible: false,
    params: {},
  },
  calendarModal: {
    visible: false,
    params: {},
  },
  subscribeModal: false,
  selectedMonth: [],
}

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCheckedTime(state, action: PayloadAction<SliceState['checkedTime']>) {
      state.checkedTime = action.payload
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
    setRouterMenu(state, action: PayloadAction<SliceState['routerMenu']>) {
      state.routerMenu = action.payload
    },

    setScheduleModal(
      state,
      action: PayloadAction<SliceState['scheduleModal']>,
    ) {
      state.scheduleModal = {
        ...state.scheduleModal,
        ...action.payload,
      }
    },
    setCalendarModal(
      state,
      action: PayloadAction<SliceState['calendarModal']>,
    ) {
      state.calendarModal = {
        ...state.calendarModal,
        ...action.payload,
      }
    },
    setSubscribeModal(
      state,
      action: PayloadAction<SliceState['subscribeModal']>,
    ) {
      state.subscribeModal = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getCalendarList.fulfilled, (state, action) => {
      state.calendarData = action.payload
      const checkManageList = action.payload.manager?.filter(
        (i: Model.Calendar.Info) => i.is_check === 1,
      )
      const checkSubList = action.payload.subscribe?.filter(
        (i: Model.Calendar.Info) => i.is_check === 1,
      )
      // 获取当前数据默认选择的日历
      state.checkedCalendarList = [...checkManageList, ...checkSubList]
    })
    // 获取日历相关配置下拉
    builder.addCase(getRelateConfig.fulfilled, (state, action) => {
      state.relateConfig = action.payload
    })
    // 获取日历配置
    builder.addCase(getCalendarConfig.fulfilled, (state, action) => {
      state.calendarConfig = action.payload
    })
    // 修改日历配置
    builder.addCase(updateCalendarConfig.fulfilled, (state, action) => {
      state.calendarConfig = action.payload
    })
    // 周视图列表
    builder.addCase(getDaysOfWeekList.fulfilled, (state, action) => {
      state.selectedWeek = action.payload
    })
    builder.addCase(getDaysOfMonthList.fulfilled, (state, action) => {
      state.selectedMonth = action.payload
    })
  },
})

const calendar = slice.reducer

export const {
  setCheckedTime,
  setCheckedCalendarList,
  setCalendarData,
  setRouterMenu,
  setCalendarModal,
  setScheduleModal,
  setSubscribeModal,
} = slice.actions

export default calendar
