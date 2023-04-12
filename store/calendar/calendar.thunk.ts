import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

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
    console.log(res, '=11212')
    return res.data
  },
)

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

export const getDaysOfWeekList = createAsyncThunk(
  `${name}/getDaysOfWeekList`,
  async (params: API.Calendar.GetDaysOfWeekList.Params) => {
    const res = await services.calendar.getDaysOfWeekList(params)
    return res.data
  },
)
