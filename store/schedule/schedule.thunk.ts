import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch, store, useDispatch } from '@store/index'
import ParamsCache from './paramsCache'
import dayjs from 'dayjs'
const name = 'schedule'
import { setCalenderLoading } from '@store/calendarPanle'
export const getScheduleListDaysOfDate = createAsyncThunk(
  `${name}/getScheduleListDaysOfDate`,
  async (params: API.Schedule.GetScheduleListDaysOfDate.Params) => {
    ParamsCache.getInstance().addCache('day', params)
    store.dispatch(setCalenderLoading(true))
    const res = await services.schedule.getScheduleListDaysOfDate(params)
    store.dispatch(setCalenderLoading(false))
    store.dispatch(setCalenderLoading(false))
    return res
  },
)

export const getScheduleListDaysOfWeek = createAsyncThunk(
  `${name}/getScheduleListDaysOfWeek`,
  async (params: API.Schedule.GetScheduleListDaysOfWeek.Params) => {
    ParamsCache.getInstance().addCache('week', params)
    store.dispatch(setCalenderLoading(true))
    const res = await services.schedule.getScheduleListDaysOfWeek(params)
    store.dispatch(setCalenderLoading(false))
    return res
  },
)

export const getScheduleListDaysOfMonth = createAsyncThunk(
  `${name}/getScheduleListDaysOfMonth`,
  async (params: API.Schedule.GetScheduleListDaysOfMonth.Params) => {
    ParamsCache.getInstance().addCache('month', params)
    store.dispatch(setCalenderLoading(true))
    const res = await services.schedule.getScheduleListDaysOfMonth(params)
    store.dispatch(setCalenderLoading(false))
    return res
  },
)

export const getCalendarDaysOfYearList = createAsyncThunk(
  `${name}/getCalendarDaysOfYearList`,
  async (params: API.Schedule.ScheduleInfoList.Params) => {
    ParamsCache.getInstance().addCache('year', params)
    store.dispatch(setCalenderLoading(true))
    const res = await services.schedule.getCalendarDaysOfYearList(params)
    store.dispatch(setCalenderLoading(false))
    return res.data
  },
)
export const getScheduleDaysOfList = createAsyncThunk(
  `${name}/getScheduleDaysOfList`,
  async (params: API.Schedule.ScheduleInfoList.Params) => {
    ParamsCache.getInstance().addCache('list', params)
    store.dispatch(setCalenderLoading(true))
    const res = await services.schedule.getCalendarDaysOfMonthList(params)
    store.dispatch(setCalenderLoading(false))
    return res.data
  },
)
// 修改日程
export const modifySchedule =
  (params: API.Schedule.ModifySchedule.Params) =>
  async (dispatch: AppDispatch) => {
    await services.schedule
      .modifySchedule(params)
      .then(() => {
        dispatch(refreshCalendarPanelScheduleList())
      })
      .catch(() => {
        dispatch(refreshCalendarPanelScheduleList())
      })
  }
export const getScheduleInfo = createAsyncThunk(
  `${name}/getScheduleInfo`,
  async (params: { id: number; show_date: string | number }) => {
    const res = await services.schedule.getScheduleInfo(params)
    return res
  },
)
// 刷新面板上日程列表
export const refreshCalendarPanelScheduleList =
  () => async (dispatch: AppDispatch) => {
    const state = store.getState()
    const { calendarPanelType } = state.calendarPanel
    const { checkedCalendarList, checkedTime } = state.calendar
    const params = ParamsCache.getInstance().getCache(calendarPanelType)
    if (!params) {
      return
    }
    const newParams = {
      ...params,
      calendar_ids: checkedCalendarList.map(item => item.calendar_id),
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
      case 'year':
        dispatch(getCalendarDaysOfYearList(newParams))
        break
      case 'list':
        dispatch(getScheduleDaysOfList(newParams))
        break
      default:
        break
    }
  }

// export const getScheduleListDaysOf = createAsyncThunk(
//   `${name}/getScheduleList`,
//   async (params: API.Schedule.GetScheduleList.Params) => {
//     // console.log('getScheduleList', params)
//     const res = await services.schedule.getScheduleList(params)
//     return res.data
//   },
// )
// export const getScheduleList = createAsyncThunk(
//   `${name}/getScheduleList`,
//   async (params: API.Schedule.GetScheduleList.Params) => {
//     // console.log('getScheduleList', params)
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
    await dispatch(refreshCalendarPanelScheduleList())
  }

export const getCalendarDaysOfMonthList = createAsyncThunk(
  `${name}/getCalendarDaysOfMonthList`,
  async (params: API.Schedule.ScheduleInfoList.Params) => {
    const res = await services.schedule.getCalendarDaysOfMonthList(params)
    return res.data
  },
)

// 左侧日历获取当月的日程
export const getLeftCalendarDaysOfMonthList = createAsyncThunk(
  `${name}/getLeftCalendarDaysOfMonthList`,
  async (params: API.Schedule.ScheduleInfoList.Params) => {
    const res = await services.schedule.getCalendarDaysOfMonthList(params)
    return res.data
  },
)

// 日程搜索
export const getScheduleSearch = createAsyncThunk(
  `${name}/getScheduleSearch`,
  async (params: API.Schedule.SearchKeys.params) => {
    const res = await services.schedule.getScheduleSearch(params)
    return res
  },
)
