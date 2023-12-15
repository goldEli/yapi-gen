import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

export const getLoginDetail = createAsyncThunk(
  'user/getLoginDetail',
  async () => {
    const result = await services.user.getLoginDetail()
    const result2 = await services.user.getUserDetail()
    console.log(result2, '=result2result2')
    const menuPermission = await services.user.getMenuPermission()
    const userPreferenceConfig =
      await services.user.getCompanyUserPreferenceConfig()

    return {
      loginInfo: result.data,
      userInfo: result2,
      menuPermission,
      userPreferenceConfig,
    }
  },
)
