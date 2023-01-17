/* eslint-disable no-duplicate-imports */
// mine
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  demandInfo: any
  isRefreshComment: boolean
  isUpdateStatus: boolean
  isUpdateChangeLog: boolean
  createCategory: any
  filterParams: any
}

const initialState: CounterState = {
  demandInfo: {},
  isRefreshComment: false,
  isUpdateStatus: false,
  isUpdateChangeLog: false,
  createCategory: {},
  filterParams: {},
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
    // 是否更新状态 -- 用于需求详情中更新状态
    setIsUpdateStatus: (state: any, action) => {
      state.isUpdateStatus = action.payload
    },
    // 是否更新变更记录 -- 用于需求详情中更新变更记录
    setIsUpdateChangeLog: (state: any, action) => {
      state.isUpdateChangeLog = action.payload
    },
    // 需求主页选中的需求类别 -- 用于回填创建弹窗
    setCreateCategory: (state: any, action) => {
      state.createCategory = action.payload
    },
    // 筛选需求列表参数，用于回填创建需求弹窗
    setFilterParams: (state: any, action) => {
      state.filterParams = action.payload
    },
  },
  extraReducers(builder) {
    //
  },
})

export const {
  setDemandInfo,
  setIsRefreshComment,
  setIsUpdateStatus,
  setIsUpdateChangeLog,
  setCreateCategory,
  setFilterParams,
} = demandSlice.actions

export default demandSlice.reducer
