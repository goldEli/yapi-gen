import { addProject, updateProject } from '@/services/project'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const postCreate = createAsyncThunk(
  'create/postCreate',
  async (value: any) => {
    await addProject(value)
  },
)

export const postEditCreate = createAsyncThunk(
  'create/postEdit',
  async (value: any) => {
    await updateProject(value)
  },
)
