import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

// 团队列表
export const companyTeamsList: any = createAsyncThunk(
  'companyTeamsList',
  (parmas: any) => services.setting.companyTeamsList(parmas),
)
