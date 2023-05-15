/* eslint-disable no-duplicate-imports */
// 需求
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  // 启用状态
  startUsing?: boolean
  demandInfo: any
  // 是否刷新评论
  isRefreshComment: boolean
  // 是否更新状态 -- 需求详情使用
  isUpdateStatus: boolean
  // 是否更新变更记录
  isUpdateChangeLog: boolean
  // 需求创建选择的需求类别
  createCategory: any
  // 过滤的参数
  filterParams: any
  // 创建需求成功后是否刷新
  isUpdateDemand: any
  // 需求详情弹窗预览
  isDemandDetailDrawerVisible: boolean
  // 需求详情弹窗预览参数
  demandDetailDrawerProps: any
}

const initialState: CounterState = {
  demandInfo: {},
  isRefreshComment: false,
  isUpdateStatus: false,
  isUpdateChangeLog: false,
  createCategory: {},
  filterParams: {},
  isUpdateDemand: false,
  startUsing: true,
  isDemandDetailDrawerVisible: false,
  demandDetailDrawerProps: {},
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
    // 刷新需求
    setIsUpdateDemand: (state: any, action) => {
      state.isUpdateDemand = action.payload
    },
    // 需求详情弹窗
    setIsDemandDetailDrawerVisible: (state: any, action) => {
      state.isDemandDetailDrawerVisible = action.payload
    },
    // 需求详情弹窗传入的props
    setDemandDetailDrawerProps: (state: any, action) => {
      state.demandDetailDrawerProps = action.payload
    },
  },
})

export const {
  setDemandInfo,
  setIsRefreshComment,
  setIsUpdateStatus,
  setIsUpdateChangeLog,
  setCreateCategory,
  setFilterParams,
  setIsUpdateDemand,

  setIsDemandDetailDrawerVisible,
  setDemandDetailDrawerProps,
  setStartUsing,
} = demandSlice.actions

export default demandSlice.reducer
