import { addViews, getViews } from '@/services/view'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getViewList = createAsyncThunk(
  'view/getViewList',
  async (id: any) => {
    const res = await getViews(id)

    return res
  },
)

export const addViewList = createAsyncThunk(
  'view/addViewList',
  async (value: any) => {
    const res = await addViews(value)
  },
)
