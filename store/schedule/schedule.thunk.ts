import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch, store } from '@store/index'
import ParamsCache from './paramsCache'

const name = 'schedule'

export const getScheduleListDaysOfDate = createAsyncThunk(
  `${name}/getScheduleListDaysOfDate`,
  async (params: API.Schedule.GetScheduleListDaysOfDate.Params) => {
    ParamsCache.getInstance().addCache('day', params)
    const res = await services.schedule.getScheduleListDaysOfDate(params)
    return res
  },
)

export const getScheduleListDaysOfWeek = createAsyncThunk(
  `${name}/getScheduleListDaysOfWeek`,
  async (params: API.Schedule.GetScheduleListDaysOfWeek.Params) => {
    ParamsCache.getInstance().addCache('week', params)
    const res = await services.schedule.getScheduleListDaysOfWeek(params)
    return res
  },
)

export const getScheduleListDaysOfMonth = createAsyncThunk(
  `${name}/getScheduleListDaysOfMonth`,
  async (params: API.Schedule.GetScheduleListDaysOfMonth.Params) => {
    ParamsCache.getInstance().addCache('month', params)
    const res = await services.schedule.getScheduleListDaysOfMonth(params)
    return res
  },
)

// 刷新面板上日程列表
export const refreshCalendarPanelScheduleList =
  () => async (dispatch: AppDispatch) => {
    const state = store.getState()
    const { calendarPanelType } = state.calendarPanel
    const { checkedCalendarList } = state.calendar
    const params = ParamsCache.getInstance().getCache(calendarPanelType)
    if (!params) {
      return
    }
    const newParams = {
      ...params,
      calendar_ids: checkedCalendarList,
    }
    switch (calendarPanelType) {
      case 'day':
        dispatch(getScheduleListDaysOfDate(newParams))
        break
      case 'week':
        dispatch(getScheduleListDaysOfWeek(newParams))
        break
      case 'month':
        dispatch(getScheduleListDaysOfMonth(newParams))
        break

      default:
        break
    }
  }

// export const getScheduleListDaysOf = createAsyncThunk(
//   `${name}/getScheduleList`,
//   async (params: API.Schedule.GetScheduleList.Params) => {
//     console.log('getScheduleList', params)
//     const res = await services.schedule.getScheduleList(params)
//     return res.data
//   },
// )
// export const getScheduleList = createAsyncThunk(
//   `${name}/getScheduleList`,
//   async (params: API.Schedule.GetScheduleList.Params) => {
//     console.log('getScheduleList', params)
//     const res = await services.schedule.getScheduleList(params)
//     return res.data
//   },
// )
// export const saveSchedule = createAsyncThunk(
//   `${name}/getScheduleList`,
//   async (params: API.Schedule.GetScheduleList.Params) => {
//     const res = await services.schedule.getScheduleList(params)
//     return res.data
//   },
// )

export const saveSchedule =
  (params: API.Schedule.SaveSchedule.Params) =>
  async (dispatch: AppDispatch) => {
    await services.schedule.saveScheduleList(params)
    dispatch(refreshCalendarPanelScheduleList())
  }

export const getCalendarDaysOfYearList = createAsyncThunk(
  `${name}/getCalendarDaysOfYearList`,
  async (params: API.Schedule.ScheduleInfoList.Params) => {
    try {
      const res = await services.schedule.getCalendarDaysOfYearList(params)
      return res.data
    } catch (error) {
      //
    }
    return ''
  },
)

export const getCalendarDaysOfMonthList = createAsyncThunk(
  `${name}/getCalendarDaysOfMonthList`,
  async (params: API.Schedule.ScheduleInfoList.Params) => {
    try {
      const res = await services.schedule.getCalendarDaysOfMonthList(params)
      return res.data
    } catch (error) {
      //
    }
    return ''
  },
)

export const getScheduleInfo = createAsyncThunk(
  `${name}/getScheduleInfo`,
  async (params: { id: number }) => {
    try {
      const res = await services.schedule.getScheduleInfo(params)
      return res
    } catch (error) {
      //
    }
    return ''
  },
)
