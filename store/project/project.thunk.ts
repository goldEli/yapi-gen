import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

const name = 'project'

// 父需求列表
export const getParentList = createAsyncThunk(
  `${name}/getParentList`,
  async (params: any) => {
    const res = await services.project.getParentList(params)
    return res
  },
)

// 项目配置列表
export const getProjectInfoValuesStore = createAsyncThunk(
  `${name}/getProjectInfoValuesStore`,
  async (params: any) => {
    const res = await services.project.getProjectInfoValues(params)
    return res
  },
)
