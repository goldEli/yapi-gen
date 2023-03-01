import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

// 团队列表
export const companyTeamsList: any = createAsyncThunk(
  'companyTeamsList',
  (params: any) => services.setting.companyTeamsList(params),
)

// 团员列表
export const getMemberList: any = createAsyncThunk(
  'getMemberList',
  (params: any) => services.setting.getMemberList(params),
)

// 添加成员弹窗数据
export const getDepartmentUserList: any = createAsyncThunk(
  'getDepartmentUserList',
  (params: any) => services.setting.getDepartmentUserList(params),
)
