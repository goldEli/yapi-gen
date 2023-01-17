/* eslint-disable no-duplicate-imports */
// 迭代
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  iterateInfo: any
  isRefreshList: boolean
}

const initialState: CounterState = {
  iterateInfo: {},
  isRefreshList: false,
}

export const iterateSlice = createSlice({
  name: 'iterate',
  initialState,
  reducers: {
    // 迭代详情
    setIterateInfo: (state: any, action) => {
      state.iterateInfo = action.payload
    },
    // 是否更新迭代列表
    setIsRefreshList: (state: any, action) => {
      state.isRefreshList = action.payload
    },
  },
  extraReducers(builder) {
    //
  },
})

export const { setIterateInfo, setIsRefreshList } = iterateSlice.actions

export default iterateSlice.reducer
