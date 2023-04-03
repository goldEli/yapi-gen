import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch } from '..'

const name = 'schedule'

export const getScheduleList = createAsyncThunk(
  `${name}/getScheduleList`,
  async (params: API.Schedule.GetScheduleList.Params) => {
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
