import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { setIsDetailScreenModal } from '.'
import { AppDispatch } from '@store/index'
import { setAffairsActivity } from '@store/affairs'

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

// 项目信息
export const getProjectInfoStore = createAsyncThunk(
  `${name}/getProjectInfo`,
  async (params: any) => {
    const res = await services.project.getProjectInfo(params)
    return res
  },
)

// 保存详情全屏弹层
export const saveScreenDetailModal =
  (params: any) => async (dispatch: AppDispatch) => {
    dispatch(setIsDetailScreenModal(params))
    dispatch(setAffairsActivity('1'))
  }

// 获取项目预警配置
export const getWarningConfigInfo = createAsyncThunk(
  `${name}/getWarningConfigInfo`,
  async (params: any) => {
    const res = await services.project.getWarningConfigInfo(params)

    return res
  },
)
