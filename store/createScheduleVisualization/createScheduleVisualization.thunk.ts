import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

const name = 'createScheduleVisualization'
export const getScheduleListForCurrentDay = createAsyncThunk(
  `${name}/getScheduleListDaysOfDate`,
  async (params: API.Schedule.GetScheduleListDaysOfDate.Params) => {
    const res = await services.schedule.getScheduleListDaysOfDate(params)
    const key = params.date

    return res[key]
  },
)
