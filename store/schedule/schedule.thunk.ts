import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

const name = 'schedule'

export const getScheduleList = createAsyncThunk(
  `${name}/getScheduleList`,
  async (params: API.Schedule.GetScheduleList.Params) => {
    const res = await services.schedule.getScheduleList(params)
    return res.data.list
  },
)
