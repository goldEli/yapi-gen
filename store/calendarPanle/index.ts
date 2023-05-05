import { formatYYYYMMDD } from '@/components/CalendarManager/config'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs, { Dayjs } from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear)
type SliceState = {
  // 日历面板类型
  calendarPanelType: Model.Calendar.CalendarPanelType
  // 快速创建日程弹窗
  quickCreateScheduleModel: {
    isAll: boolean
    startTime: string
    endTime: string
    visible: boolean
    x: number
    y: number
  }
  // 查看日程详情弹窗
  scheduleInfoDropdown: {
    visible: boolean
    x: number
    y: number
    schedule_id: Model.Schedule.Info['schedule_id']
    show_date: string | number
  }
  calenderYearType: Model.Calendar.CalendarYearType
  calenderListValue: string
  calenderTypeValue: string
  // 月视图拖拽日程时，控制显示
  monthMoveScheduleActiveInfo: {
    startSchedule?: Model.Schedule.Info
    startIndex?: number
    endIndex?: number
    visibleList?: number[]
    // 包含几个日程
    length?: number
  }
  //搜索日程关键字
  scheduleSearchKey?: string
  // 月视图，当前点击的日期
  selectedDayInMonth?: Model.Calendar.DaysOfMonth['datetime']
  // 跨天头天index记录，用于非头天渲染
  firstDataIndexInfo?: {
    firstDayInfo: Model.Schedule.Info
    index: number
  }[]
  calendarLoading: boolean
}
const defaultMonthMoveScheduleActiveInfo = {
  visibleList: [],
}

const initialState: SliceState = {
  calendarPanelType: 'week',
  quickCreateScheduleModel: {
    isAll: false,
    startTime: '',
    endTime: '',
    visible: false,
    x: 0,
    y: 0,
  },
  scheduleInfoDropdown: {
    visible: false,
    x: 0,
    y: 0,
    schedule_id: 0,
    show_date: '',
  },
  calenderTypeValue: dayjs().format(formatYYYYMMDD),
  calenderListValue: dayjs().format(formatYYYYMMDD),
  calenderYearType: 0,
  monthMoveScheduleActiveInfo: defaultMonthMoveScheduleActiveInfo,
  calendarLoading: true,
}

const slice = createSlice({
  name: 'calendarPanel',
  initialState,
  reducers: {
    setFirstDataIndexInfo(
      state,
      action: PayloadAction<SliceState['firstDataIndexInfo']>,
    ) {
      state.firstDataIndexInfo = action.payload
    },
    setSelectedDayInMonth(
      state,
      action: PayloadAction<SliceState['selectedDayInMonth']>,
    ) {
      state.selectedDayInMonth = action.payload
    },
    clearMonthMoveScheduleActiveInfo(state) {
      state.monthMoveScheduleActiveInfo = defaultMonthMoveScheduleActiveInfo
      window.monthMoveScheduleActiveInfo = defaultMonthMoveScheduleActiveInfo
    },
    startMoveMonthSchedule(
      state,
      action: PayloadAction<SliceState['monthMoveScheduleActiveInfo']>,
    ) {
      // const all = store.getState()

      const newState = {
        ...state.monthMoveScheduleActiveInfo,
        ...action.payload,
      }
      // 日程包含几天
      const len = newState?.length ?? 0

      // 开始坐标
      const min = newState.endIndex ?? 0
      // 结束坐标
      const max = min + len
      // 移动后，展示跨天日程的下标
      const list = Array.from(Array(42).keys()).slice(min, max)
      const d = {
        ...newState,
        visibleList: list,
      }
      state.monthMoveScheduleActiveInfo = d
      window.monthMoveScheduleActiveInfo = d
    },
    resizeMonthSchedule(
      state,
      action: PayloadAction<SliceState['monthMoveScheduleActiveInfo']>,
    ) {
      // const all = store.getState()
      const newState = {
        ...state.monthMoveScheduleActiveInfo,
        ...action.payload,
      }
      const { startIndex = 0, endIndex = 0, length = 0 } = newState
      const len = length

      const min = endIndex ?? 0
      const max = startIndex + len
      // 往前扩大天数时，往后拉的最大极限是不能小于最后一天
      if (min >= max) {
        return
      }

      const list = Array.from(Array(42).keys()).slice(min, max)
      state.monthMoveScheduleActiveInfo = {
        ...newState,
        visibleList: list,
      }
      window.monthMoveScheduleActiveInfo = state.monthMoveScheduleActiveInfo
    },

    setCalendarPanelType(
      state,
      action: PayloadAction<SliceState['calendarPanelType']>,
    ) {
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
      // 关闭弹窗清空月视图选中
      if (!state.quickCreateScheduleModel.visible) {
        state.selectedDayInMonth = void 0
      }
    },
    setScheduleInfoDropdown(
      state,
      action: PayloadAction<Partial<SliceState['scheduleInfoDropdown']>>,
    ) {
      // 如果创建日程打开，阻止查看日程详情
      if (state.quickCreateScheduleModel.visible) {
        return
      }
      state.scheduleInfoDropdown = {
        ...state.scheduleInfoDropdown,
        ...action.payload,
      }
    },
    setCalenderDayValue(
      state,
      action: PayloadAction<SliceState['calenderTypeValue']>,
    ) {
      state.calenderTypeValue = action.payload
    },
    setCalenderListValue(
      state,
      action: PayloadAction<SliceState['calenderListValue']>,
    ) {
      state.calenderListValue = action.payload
    },

    setCalenderYearType(
      state,
      action: PayloadAction<SliceState['calenderYearType']>,
    ) {
      state.calenderYearType = action.payload
    },
    setCalenderLoading(state, action: PayloadAction<boolean>) {
      state.calendarLoading = action.payload
    },
    setInitScheduleInfoDropdown(
      state,
      action: PayloadAction<Partial<SliceState['scheduleInfoDropdown']>>,
    ) {
      state.scheduleInfoDropdown = {
        ...state.scheduleInfoDropdown,
        ...action.payload,
      }
    },
    clearCalenderValue(state) {
      state.calenderTypeValue = initialState.calenderTypeValue
      state.calenderListValue = initialState.calenderListValue
    },
    setCalenderTypeValue(state, action) {
      state.calenderTypeValue = action.payload
    },
  },
})

const calendarPanel = slice.reducer

export const {
  setCalendarPanelType,
  setScheduleInfoDropdown,
  setCalenderDayValue,
  setCalenderYearType,
  setCalenderListValue,
  startMoveMonthSchedule,
  clearMonthMoveScheduleActiveInfo,
  resizeMonthSchedule,
  setQuickCreateScheduleModel,
  setSelectedDayInMonth,
  setFirstDataIndexInfo,
  setCalenderLoading,
  setInitScheduleInfoDropdown,
  clearCalenderValue,
  setCalenderTypeValue,
} = slice.actions

export default calendarPanel
