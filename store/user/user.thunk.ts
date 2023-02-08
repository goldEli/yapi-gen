import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

export const getLoginDetail = createAsyncThunk(
  'user/getLoginDetail',
  async () => {
    const result = await services.user.getLoginDetail()
    const result2 = await services.user.getUserDetail()
    return { loginInfo: result.data, userInfo: result2 }
  },
)
