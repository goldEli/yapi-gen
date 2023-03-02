/* eslint-disable no-duplicate-imports */
// 需求
import { createSlice } from '@reduxjs/toolkit'
import { storyConfigCategoryList, getCategoryConfigList } from './thunk'

export interface CounterState {
  // 启用状态
  startUsing?: boolean
  // 需求类别
  categoryList?: any
  // 需求总列表
  getCategoryConfigDataList: any
  activeCategory: any
}

const initialState: CounterState = {
  startUsing: true,
  categoryList: [],
  getCategoryConfigDataList: {},
  activeCategory: {},
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
  },
  extraReducers(builder) {
    builder.addCase(storyConfigCategoryList.fulfilled, (state, action) => {
      const data = action.payload.list
      state.categoryList = data?.map((el: any, index: any) => ({
        ...el,
        active: index === 0 ? true : false,
      }))
    })
    builder.addCase(getCategoryConfigList.fulfilled, (state, action) => {
      const data = action.payload
      state.getCategoryConfigDataList.isFoldT = data.filter(
        (el: any) => el.isFold === 2,
      )
      state.getCategoryConfigDataList.isFoldF = data.filter(
        (el: any) => el.isFold === 1,
      )
    })
  },
})

export const { setStartUsing, setActiveCategory } = category.actions

export default category.reducer
