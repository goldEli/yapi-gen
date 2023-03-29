import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

const name = 'calendar'

export const getCalendarList = createAsyncThunk(
  `${name}/getCalendarList`,
  async () => {
    const res = await services.calendar.getCalendarList()
    return res.data
  },
)
