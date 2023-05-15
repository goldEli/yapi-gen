/* eslint-disable no-duplicate-imports */
// 公用状态管理
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

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
  basicFieldList: any[]
  tagOrPriority: any[]
  // 列表选中id
  listActiveId: number
}

const initialState: GlobalState = {
  firstMenuCollapse: false,
  theme: Number(localStorage.getItem('theme')) || 0,
  language: localStorage.getItem('language') || 'zh',
  basicFieldList: [
    { content: 'schedule', attr: 'slider' },
    {
      content: 'users_name',
      keyText: 'users',
      attr: 'fixed_select',
    },
    {
      content: 'users_copysend_name',
      keyText: 'copysend',
      attr: 'fixed_select',
    },
    { content: 'user_name', attr: 'select' },
    {
      content: 'parent_id',
      attr: 'parentSelect',
    },
    {
      content: 'iterate_name',
      keyText: 'iterate_id',
      attr: 'fixed_radio',
    },
    {
      content: 'class',
      keyText: 'class_id',
      attr: 'treeSelect',
    },
    { content: 'priority', attr: 'priority' },
    { content: 'create_at', attr: 'date' },
    { content: 'finish_at', attr: 'date' },
    {
      content: 'expected_start_at',
      attr: 'date',
      keyText: 'expected_start_at',
      value: ['date'],
    },
    {
      content: 'expected_end_at',
      attr: 'date',
      keyText: 'expected_end_at',
      value: ['date'],
    },
  ],
  tagOrPriority: [
    { key: 'extremely-low', backgroundColor: '--function-tag1' },
    { key: 'middle', backgroundColor: '--function-tag5' },
    { key: 'extremely-high', backgroundColor: '--function-tag3' },
    { key: 'low', backgroundColor: '--function-tag2' },
    { key: 'high', backgroundColor: '--function-tag4' },
    { key: 'openEd', backgroundColor: '--function-tag5' },
    { key: 'endEd', backgroundColor: '--function-tag2' },
    { key: 'closeEd', backgroundColor: '--function-tag6' },
  ],
  listActiveId: 0,
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
    setListActiveId(preState: GlobalState, action) {
      preState.listActiveId = action.payload
    },
  },
  extraReducers: builder => {
    //
  },
})

export const { setListActiveId } = globalSlice.actions

export default globalSlice.reducer
