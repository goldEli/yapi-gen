import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch } from '@store/index'

const name = 'schedule'

export const getScheduleListDaysOfDate = createAsyncThunk(
  `${name}/getScheduleListDaysOfDate`,
  async (params: API.Schedule.GetScheduleListDaysOfDate.Params) => {
    const res = await services.schedule.getScheduleListDaysOfDate(params)
    return res
  },
)

export const getScheduleListDaysOfWeek = createAsyncThunk(
  `${name}/getScheduleListDaysOfWeek`,
  async (params: API.Schedule.GetScheduleListDaysOfWeek.Params) => {
    const res = await services.schedule.getScheduleListDaysOfWeek(params)
    return res
  },
)

export const getScheduleListDaysOfMonth = createAsyncThunk(
  `${name}/getScheduleListDaysOfMonth`,
  async (params: API.Schedule.GetScheduleListDaysOfMonth.Params) => {
    const res = await services.schedule.getScheduleListDaysOfMonth(params)
    return res
  },
)
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
    // TODO refresh list
    // dispatch(getScheduleList({ id: 1 }))
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
  async (params: { id: number,show_date:string | number }) => {
    try {
      const res = await services.schedule.getScheduleInfo(params)
      return res
    } catch (error) {
      //
    }
    return ''
  },
)

export const scheduleInfoReply = createAsyncThunk(
  `${name}/scheduleInfoReply`,
  async (params: { id: number,status:number }) => {
    try {
      const res = await services.schedule.scheduleInfoReply(params)
      return res
    } catch (error) {
      //
    }
    return ''
  },
)
