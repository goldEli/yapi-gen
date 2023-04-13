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
  basicFieldList: any[]
  tagOrPriority: any[]
}

const initialState: GlobalState = {
  firstMenuCollapse: false,
  theme: Number(localStorage.getItem('theme')) || 0,
  language: localStorage.getItem('language') || 'zh',
  basicFieldList: [
    { name: '需求进度', content: 'schedule', type: '数字型', attr: 'slider' },
    {
      name: '处理人',
      content: 'users_name',
      type: '人员多选',
      keyText: 'users',
      attr: 'fixed_select',
    },
    {
      name: '抄送人',
      content: 'users_copysend_name',
      type: '人员多选',
      keyText: 'copysend',
      attr: 'fixed_select',
    },
    { name: '创建人', content: 'user_name', type: '人员单选', attr: 'select' },
    {
      name: '父需求',
      content: 'parent_id',
      type: '单选下拉',
      attr: 'parentSelect',
    },
    {
      name: '迭代',
      content: 'iterate_name',
      type: '单选下拉',
      keyText: 'iterate_id',
      attr: 'fixed_radio',
    },
    {
      name: '需求分类',
      content: 'class',
      type: '单选下拉',
      keyText: 'class_id',
      attr: 'treeSelect',
    },
    { name: '优先级', content: 'priority', type: '单选下拉', attr: 'priority' },
    { name: '创建时间', content: 'create_at', type: '日期', attr: 'date' },
    { name: '完成时间', content: 'finish_at', type: '日期', attr: 'date' },
    {
      name: '预计开始时间',
      content: 'expected_start_at',
      type: '日期',
      attr: 'date',
      keyText: 'expected_start_at',
      value: ['date'],
    },
    {
      name: '预计结束时间',
      content: 'expected_end_at',
      type: '日期',
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
  // screenMin: window.innerWidth <= 1440,
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
  },
  extraReducers: builder => {
    //
  },
})

export default globalSlice.reducer
