import { store } from './../index'
import {
  addProject,
  updateProject,
  getProjectPermission,
} from '@/services/project'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setIsUpdateProject } from '.'

export const postCreate = createAsyncThunk(
  'create/postCreate',
  async (value: any) => {
    const res = await addProject(value)
    store.dispatch(
      setIsUpdateProject(store.getState().createProject.isUpdateProject + 1),
    )
    return res
  },
)

export const postEditCreate = createAsyncThunk(
  'create/postEdit',
  async (value: any) => {
    const res = await updateProject(value)
    store.dispatch(
      setIsUpdateProject(store.getState().createProject.isUpdateProject + 1),
    )
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
