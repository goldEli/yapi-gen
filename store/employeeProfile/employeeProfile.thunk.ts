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

// 统计数据
export const getMemberOverviewStatistics = createAsyncThunk(
  `${name}/getMemberOverviewStatistics`,
  async (params: any) => {
    const res = await services.employeeProfile.getMemberOverviewStatistics(
      params,
    )
    return res
  },
)
