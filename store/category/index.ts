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
  option: any
}

const initialState: CounterState = {
  startUsing: true,
  categoryList: [],
  // 需求列表所有数据以及拆分数据
  getCategoryConfigDataList: {},
  activeCategory: {},
  // 项目已有字段
  getProjectFieIdsData: [],
  // 存基本信息所有数据过滤用
  getCategoryConfigArray: [],
  option: [
    {
      label: 'newlyAdd.lineText',
      value: '1',
      type: 'text',
      icon: 'text-alone',
    },
    {
      label: 'newlyAdd.moreLineText',
      value: '2',
      type: 'textarea',
      icon: 'text-more',
    },
    {
      label: 'newlyAdd.radioDropdown',
      value: '3',
      type: 'select',
      icon: 'select-alone',
    },
    {
      label: 'newlyAdd.multiDropdown',
      value: '4',
      type: 'select_checkbox',
      icon: 'select-more',
    },
    { label: 'newlyAdd.time', value: '7', type: 'date', icon: 'calendar' },
    { label: 'newlyAdd.number', value: '8', type: 'number', icon: 'number' },
    {
      label: 'version2.personRadio',
      value: '9',
      type: 'user_select',
      icon: 'user-alone',
    },
    {
      label: 'version2.personCheckbox',
      value: '10',
      type: 'user_select_checkbox',
      icon: 'user-more',
    },
    {
      label: 'confirm_that_it_is_checked',
      value: '11',
      type: 'single_checkbox',
      icon: 'check-circle',
    },
  ],
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
      if (action.payload) {
        state.activeCategory = action.payload
      }
    },
    setGetCategoryConfigArray: (state: any, action) => {
      state.getCategoryConfigArray = action.payload
    },
    setProjectFieIdsData: (state: any, action) => {
      state.getProjectFieIdsData = action.payload
    },
    setCategoryConfigDataList: (state: any, action) => {
      state.getCategoryConfigDataList = {
        configDataList: [],
        isFoldT: [],
        isFoldF: [],
      }
    },
    setCategoryList: (state: any, action) => {
      state.categoryList = []
    },
  },
  extraReducers(builder) {
    builder.addCase(storyConfigCategoryList.fulfilled, (state, action) => {
      const data = action.payload.list
      state.categoryList = data
    })
    builder.addCase(getCategoryConfigList.fulfilled, (state, action) => {
      const data = action.payload
      state.getCategoryConfigDataList = {
        configDataList: data,
        isFoldT: data.filter((el: any) => el.isFold === 2),
        isFoldF: data.filter((el: any) => el.isFold === 1),
      }
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
  setCategoryConfigDataList,
  setCategoryList,
} = category.actions

export default category.reducer
