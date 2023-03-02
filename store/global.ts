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
      attr: { attr: 'user_select_checkbox', value: 'projectMember' },
    },
    {
      name: '抄送人',
      content: 'priority',
      type: '人员多选',
      attr: { attr: 'user_select_checkbox', value: 'companyMember' },
    },
    { name: '创建人', content: 'priority', type: '人员单选', attr: 'select' },
    {
      name: '父需求',
      content: 'priority',
      type: '单选下拉',
      attr: 'parentSelect',
    },
    {
      name: '迭代',
      content: 'priority',
      type: '单选下拉',
      attr: 'select_checkbox',
    },
    {
      name: '需求分类',
      content: 'priority',
      type: '单选下拉',
      attr: 'treeSelect',
    },
    { name: '优先级', content: 'priority', type: '单选下拉', attr: 'priority' },
    { name: '创建时间', content: '', type: '日期', attr: ' date' },
    { name: '完成时间', content: 'priority', type: '日期', attr: ' date' },
    { name: '预计开始时间', content: 'priority', type: '日期', attr: ' date' },
    { name: '预计结束时间', content: 'priority', type: '日期', attr: ' date' },
  ],
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
