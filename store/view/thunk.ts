import { addViews, getViews } from '@/services/view'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getViewList = createAsyncThunk(
  'view/getViewList',
  async (params: { projectId: number; type: number }) => {
    const res = await getViews(params)

    return res
  },
)

export const addViewList = createAsyncThunk(
  'view/addViewList',
  async (value: any) => {
    const res = await addViews(value)
  },
)
