/* eslint-disable no-duplicate-imports */
// 需求
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  // 查看汇报抽屉
  viewReportModal: {
    visible: boolean
    id: number
    ids: number[]
  }
}

const initialState: CounterState = {
  viewReportModal: {
    visible: false,
    id: 0,
    ids: [],
  },
}

export const demandSlice = createSlice({
  name: 'demand',
  initialState,
  reducers: {
    // 启用状态
    setViewReportModal: (state: any, action) => {
      state.viewReportModal = action.payload
    },
  },
  extraReducers(builder) {
    //
  },
})

export const { setViewReportModal } = demandSlice.actions

export default demandSlice.reducer
