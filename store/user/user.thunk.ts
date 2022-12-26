import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

export const getLoginDetail = createAsyncThunk(
  'user/getLoginDetail',
  async () => {
    const result = await services.user.getLoginDetail()
    return result.data
  },
)
