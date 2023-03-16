/* eslint-disable no-duplicate-imports */
// 迭代
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  iterateInfo: any
  isRefreshList: boolean
  isUpdateList: boolean
  achieveInfo: any
  filterParams: any
  // 新增
  isCreateIterationVisible: boolean
  // 创建或编辑的参数
  createIterationParams: any
}

const initialState: CounterState = {
  iterateInfo: {},
  isRefreshList: false,
  isUpdateList: false,
  achieveInfo: {},
  filterParams: {},

  isCreateIterationVisible: false,
  createIterationParams: {},
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
    // 是否更新迭代列表 -- 用于直接替换项目配置下的迭代数据
    setIsUpdateList: (state: any, action) => {
      state.isUpdateList = action.payload
    },
    // 用于迭代成果详情
    setAchieveInfo: (state: any, action) => {
      state.achieveInfo = action.payload
    },
    // 筛选需求列表参数，用于回填创建需求弹窗
    setFilterParams: (state: any, action) => {
      state.filterParams = action.payload
    },

    // 创建迭代或者是编辑迭代
    setIsCreateIterationVisible: (state: any, action) => {
      state.isCreateIterationVisible = action.payload
    },
    // 创建迭代或者是编辑迭代
    setCreateIterationParams: (state: any, action) => {
      state.createIterationParams = action.payload
    },
  },
  extraReducers(builder) {
    //
  },
})

export const {
  setIterateInfo,
  setIsRefreshList,
  setIsUpdateList,
  setAchieveInfo,
  setFilterParams,

  setIsCreateIterationVisible,
  setCreateIterationParams,
} = iterateSlice.actions

export default iterateSlice.reducer
