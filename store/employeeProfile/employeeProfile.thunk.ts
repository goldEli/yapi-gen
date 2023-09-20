import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

// 成员列表
export const getMemberOverviewList = createAsyncThunk(
  `${name}/getMemberOverviewList`,
  async () => {
    const res = await services.employeeProfile.getMemberOverviewList()
    return res
  },
)
