import { store } from './../index'
import { addProject, updateProject } from '@/services/project'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { onRest } from '.'

export const postCreate = createAsyncThunk(
  'create/postCreate',
  async (value: any) => {
    await addProject(value)
    store.dispatch(onRest(true))
  },
)

export const postEditCreate = createAsyncThunk(
  'create/postEdit',
  async (value: any) => {
    await updateProject(value)
    store.dispatch(onRest(true))
  },
)
