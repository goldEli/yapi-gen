/* eslint-disable no-duplicate-imports */
// 公用状态管理
import { createSlice } from '@reduxjs/toolkit'

export interface GlobalState {
  /**
   * 一级菜单是否折叠
   * */
  firstMenuCollapse: boolean

  /**
   * 主题
   * */
  theme: number

  language: string
}

const initialState: GlobalState = {
  firstMenuCollapse: false,
  theme: 0,
  language: 'zh',
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setFirstMenuCollapse(preState: GlobalState, action) {
      preState.firstMenuCollapse = action.payload
    },
    setTheme(preState: GlobalState, action) {
      preState.theme = action.payload
    },
    setLanguage(preState: GlobalState, action) {
      preState.language = action.payload
    },
  },
  extraReducers: builder => {
    //
  },
})

export default globalSlice.reducer
