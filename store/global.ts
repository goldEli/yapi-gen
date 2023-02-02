/* eslint-disable no-duplicate-imports */
// 公用状态管理
import { createSlice } from '@reduxjs/toolkit'
import { whiteTheme } from '@/theme'

export interface GlobalState {
  /**
   * 一级菜单是否折叠
   * */
  firstMenuCollapse: boolean

  /**
   * 主题
   * */
  theme: {
    type: 'white' | 'black'
    themeColors: typeof whiteTheme
  }
}

const initialState: GlobalState = {
  firstMenuCollapse: false,
  theme: {
    type: 'white',
    themeColors: whiteTheme,
  },
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
  },
  extraReducers: builder => {
    //
  },
})

export default globalSlice.reducer
