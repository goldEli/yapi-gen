import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

// 需求详情
export const getIterateInfo = createAsyncThunk(
  `${name}/getIterateInfo`,
  async (params: any) => {
    const res = await services.iterate.getIterateInfo(params)
    return res
  },
)
