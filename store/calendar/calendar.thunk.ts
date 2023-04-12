import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch } from '@store/index'

const name = 'calendar'

// 获取日历列表
export const getCalendarList = createAsyncThunk(
  `${name}/getCalendarList`,
  async () => {
    const res = await services.calendar.getCalendarList()
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
  async () => {
    const res = await services.calendar.getCalendarConfig()
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
