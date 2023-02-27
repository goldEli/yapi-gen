import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

export const getLoginDetail = createAsyncThunk(
  'user/getLoginDetail',
  async () => {
    const result = await services.user.getLoginDetail()
    const result2 = await services.user.getUserDetail()
    const result3 = await services.user.getMenuPermission()
    return {
      loginInfo: result.data,
      userInfo: result2,
      menuPermission: result3,
    }
  },
)
