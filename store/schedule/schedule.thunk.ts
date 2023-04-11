import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch } from '@store/index'

const name = 'schedule'

export const getScheduleList = createAsyncThunk(
  `${name}/getScheduleList`,
  async (params: API.Schedule.GetScheduleList.Params) => {
    console.log('getScheduleList', params)
    const res = await services.schedule.getScheduleList(params)
    return res.data
  },
)
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
      const r = await services.schedule.saveScheduleList(params)
      dispatch(getScheduleList({ id: 1 }))
    }


export const getCalendarDaysOfYearList = createAsyncThunk(
  `${name}/getCalendarDaysOfYearList`,
  async (params: API.Schedule.ScheduleInfoList.Params) => {
    try {
      const res = await services.schedule.getCalendarDaysOfYearList(params)
      return res.data
    } catch (error) {

    }
  },
)

export const getCalendarDaysOfMonthList = createAsyncThunk(
  `${name}/getCalendarDaysOfMonthList`,
  async (params: API.Schedule.ScheduleInfoList.Params) => {
    try {
      const res = await services.schedule.getCalendarDaysOfMonthList(params)
      return res.data
    } catch (error) {

    }
  },
)