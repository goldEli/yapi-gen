import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch } from '@store/index'
import { refreshCalendarPanelScheduleList } from '@store/schedule/schedule.thunk'
import { setIsRefresh } from '@store/user'

const name = 'calendar'

// 获取日历列表
export const getCalendarList = createAsyncThunk(
  `${name}/getCalendarList`,
  async (_, { dispatch }) => {
    const res = await services.calendar.getCalendarList()
    setTimeout(() => {
      dispatch(refreshCalendarPanelScheduleList() as AppDispatch)
    }, 0)
    return res.data
  },
)
// 日历月列表
export const getDaysOfMonthList = createAsyncThunk(
  `${name}/getDaysOfMonthList`,
  async (params: API.Calendar.GetDaysOfMonthList.Params) => {
    const res = await services.calendar.getDaysOfMonthList(params)
    return res.data
  },
)
// 获取日历相关配置下拉
export const getRelateConfig = createAsyncThunk(
  `${name}/getRelateConfig`,
  async () => {
    const res = await services.calendar.getRelateConfig()
    return res.data
  },
)

// 用户日历设置接口
export const userSetupsCalendar =
  (params: API.Calendar.UserSetupsCalendar.Params) =>
  async (dispatch: AppDispatch) => {
    await services.calendar.userSetupsCalendar(params)
    dispatch(getCalendarList())
  }

// 获取日历设置配置
export const getCalendarConfig = createAsyncThunk(
  `${name}/getCalendarConfig`,
  async (_, { dispatch }) => {
    const res = await services.calendar.getCalendarConfig()
    dispatch(setIsRefresh(false))
    return res
  },
)

// 修改日历设置配置
export const updateCalendarConfig = createAsyncThunk(
  `${name}/updateCalendarConfig`,
  async (params: Model.Calendar.UpdateCalendarConfigParams) => {
    const res = await services.calendar.updateCalendarConfig(params)
    return res
  },
)

// 日历周列表
export const getDaysOfWeekList = createAsyncThunk(
  `${name}/getDaysOfWeekList`,
  async (params: API.Calendar.GetDaysOfWeekList.Params) => {
    const res = await services.calendar.getDaysOfWeekList(params)
    return res.data
  },
)
