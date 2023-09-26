import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

// 成员列表
export const getPerformanceInsightPersonList = createAsyncThunk(
  `${name}/getPerformanceInsightPersonList`,
  async (params: any) => {
    const res =
      await services.performanceInsight.getPerformanceInsightPersonList(params)
    return res
  },
)
