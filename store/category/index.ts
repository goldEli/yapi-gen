/* eslint-disable no-duplicate-imports */
// 需求
import { createSlice } from '@reduxjs/toolkit'
import {
  storyConfigCategoryList,
  getCategoryConfigList,
  getProjectFieIds,
} from './thunk'

export interface CounterState {
  // 启用状态
  startUsing?: boolean
  // 需求类别
  categoryList?: any
  // 需求总列表
  getCategoryConfigDataList: any
  activeCategory: any
  // 项目已有字段
  getProjectFieIdsData: any
  getCategoryConfigArray: any
}

const initialState: CounterState = {
  startUsing: true,
  categoryList: [],
  // 需求列表所有数据以及拆分数据
  getCategoryConfigDataList: {},
  activeCategory: {},
  // 项目已有字段
  getProjectFieIdsData: [],
  getCategoryConfigArray: [],
}

export const category = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // 启用状态
    setStartUsing: (state: any, action) => {
      state.startUsing = action.payload
    },
    // 当前选中的需求类别
    setActiveCategory: (state: any, action) => {
      state.activeCategory = action.payload
    },
    setGetCategoryConfigArray: (state: any, action) => {
      state.getCategoryConfigArray = action.payload
    },
    setProjectFieIdsData: (state: any, action) => {
      state.getProjectFieIdsData = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(storyConfigCategoryList.fulfilled, (state, action) => {
      const data = action.payload.list
      state.categoryList = data
    })
    builder.addCase(getCategoryConfigList.fulfilled, (state, action) => {
      const data = action.payload
      state.getCategoryConfigDataList.configDataList = data
      state.getCategoryConfigDataList.isFoldT = data.filter(
        (el: any) => el.isFold === 2,
      )
      state.getCategoryConfigDataList.isFoldF = data.filter(
        (el: any) => el.isFold === 1,
      )
    })
    builder.addCase(getProjectFieIds.fulfilled, (state, action) => {
      action.payload.data
    })
  },
})

export const {
  setStartUsing,
  setActiveCategory,
  setGetCategoryConfigArray,
  setProjectFieIdsData,
} = category.actions

export default category.reducer
