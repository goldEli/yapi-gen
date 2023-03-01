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
  isUpdateDemandList: any
  // 是否打开创建需求弹窗
  isCreateDemandVisible: boolean
  // 创建需求弹窗传入
  createDemandProps: {
    // 编辑需求传入的id
    demandId?: any
    // 迭代-需求列表带入迭代id
    iterateId?: any
    // 编辑带入项目id
    projectId?: any
    // 是否为子需求
    isChild?: any
    // 父需求id --- 和isChild一起使用
    parentId?: any
    // 我的-快速创建
    isQuickCreate?: any
    // 是否是所有项目
    isAllProject?: boolean
    // 是否是需求详情，用于更新需求状态
    isInfo?: any
    // 子需求列表
    childList?: any
    // 子需求延用父需求类别
    categoryId?: any
    // 无数据创建
    noDataCreate?: any
    // 是否是全局创建
    overallCreate?: boolean
  }
}

const initialState: CounterState = {
  demandInfo: {},
  isRefreshComment: false,
  isUpdateStatus: false,
  isUpdateChangeLog: false,
  createCategory: {},
  filterParams: {},
  isUpdateDemandList: false,

  isCreateDemandVisible: false,
  createDemandProps: {},
  startUsing: true,
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
    // 刷新需求列表
    setIsUpdateDemandList: (state: any, action) => {
      state.isUpdateDemandList = action.payload
    },

    // 创建需求弹窗
    setIsCreateDemandVisible: (state: any, action) => {
      state.isCreateDemandVisible = action.payload
    },
    // 创建弹窗传入的props
    setCreateDemandProps: (state: any, action) => {
      state.createDemandProps = action.payload
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
  setIsUpdateDemandList,

  setIsCreateDemandVisible,
  setCreateDemandProps,
  setStartUsing,
} = demandSlice.actions

export default demandSlice.reducer
