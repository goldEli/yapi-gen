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
   * 二级菜单是否折叠
   * */
  secondaryMenuCollapse: boolean
  /**
   * 主题
   * */
  theme: any
}

const initialState: GlobalState = {
  firstMenuCollapse: false,
  secondaryMenuCollapse: false,
  theme: {
    type: 'white',
    themeColors: whiteTheme,
  },
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setSecondaryMenuCollapse(preState: GlobalState, action) {
      preState.secondaryMenuCollapse = action.payload
    },
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
