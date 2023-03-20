import { store } from './../index'
import { addProject, updateProject } from '@/services/project'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { onRest } from '.'

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
