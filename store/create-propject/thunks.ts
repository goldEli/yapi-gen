import { store } from './../index'
import {
  addProject,
  updateProject,
  getProjectPermission,
} from '@/services/project'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const postCreate = createAsyncThunk(
  'create/postCreate',
  async (value: any) => {
    const res = await addProject(value)
    return res
  },
)

export const postEditCreate = createAsyncThunk(
  'create/postEdit',
  async (value: any) => {
    const res = await updateProject(value)
    return res
  },
)

// 获取改项目的角色列表
export const getProjectRole = createAsyncThunk(
  'create/getProjectRole',
  async (params: any) => {
    const res = await getProjectPermission(params)
    return res
  },
)
