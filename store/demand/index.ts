/* eslint-disable no-duplicate-imports */
// 需求
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getDemandCommentList, getDemandInfo } from './demand.thunk'

export interface CounterState {
  // 启用状态
  startUsing?: boolean
  demandInfo: any
  // 需求详情弹窗预览
  isDemandDetailDrawerVisible: boolean
  // 需求详情弹窗预览参数
  demandDetailDrawerProps: any
  demandCommentList: {
    list: any[]
  }
}

const initialState: CounterState = {
  demandInfo: {},
  startUsing: true,
  isDemandDetailDrawerVisible: false,
  demandDetailDrawerProps: {},
  demandCommentList: {
    list: [],
  },
}

export const demandSlice = createSlice({
  name: 'demand',
  initialState,
  reducers: {
    // 启用状态
    setStartUsing: (state: any, action) => {
      state.startUsing = action.payload
    },
    // 需求详情
    setDemandInfo: (state: any, action) => {
      state.demandInfo = action.payload
    },
    // 需求详情弹窗
    setIsDemandDetailDrawerVisible: (state: any, action) => {
      state.isDemandDetailDrawerVisible = action.payload
    },
    // 需求详情弹窗传入的props
    setDemandDetailDrawerProps: (state: any, action) => {
      state.demandDetailDrawerProps = action.payload
    },
    setDemandCommentList(state, action) {
      state.demandCommentList = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getDemandInfo.fulfilled, (state, action) => {
      state.demandInfo = action.payload
    })
    builder.addCase(getDemandCommentList.fulfilled, (state, action) => {
      state.demandCommentList = action.payload
    })
  },
})

export const {
  setDemandInfo,
  setIsDemandDetailDrawerVisible,
  setDemandDetailDrawerProps,
  setStartUsing,
  setDemandCommentList,
} = demandSlice.actions

export default demandSlice.reducer
