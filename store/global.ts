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

  currentMenu: {
    id: number
    name: string
    url: string
    permission: string
    children: any[]
    icon: string
  }
}

const initialState: GlobalState = {
  firstMenuCollapse: false,
  theme: Number(localStorage.getItem('theme')) || 0,
  language: localStorage.getItem('language') || 'zh',
  currentMenu: {
    id: 0,
    name: '公司概况',
    url: '/Situation',
    permission: '',
    icon: 'system-nor',
    children: [],
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
      localStorage.setItem('theme', action.payload)
      preState.theme = action.payload
    },
    setLanguage(preState: GlobalState, action) {
      localStorage.setItem('language', action.payload)
      preState.language = action.payload
    },
    setCurrentMenu(preState: GlobalState, action) {
      preState.currentMenu = action.payload
    },
  },
  extraReducers: builder => {
    //
  },
})

export default globalSlice.reducer
