/* eslint-disable no-duplicate-imports */
// mine
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  demandInfo: any
  isRefreshComment: boolean
}

const initialState: CounterState = {
  demandInfo: {},
  isRefreshComment: false,
}

export const demandSlice = createSlice({
  name: 'demand',
  initialState,
  reducers: {
    // 需求详情
    setDemandInfo: (state: any, action) => {
      state.demandInfo = action.payload
    },
    // 更新评论列表 -- 用于流转成功后更新评论
    setIsRefreshComment: (state: any, action) => {
      state.isRefreshComment = action.payload
    },
  },
  extraReducers(builder) {
    //
  },
})

export const { setDemandInfo, setIsRefreshComment } = demandSlice.actions

export default demandSlice.reducer
