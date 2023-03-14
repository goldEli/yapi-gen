/* eslint-disable no-undefined */
/* eslint-disable no-duplicate-imports */
// 项目
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  projectInfo: any
  workList: any
  colorList: any[]
  isChangeProject: number | string
  filterParamsModal: any
  isRefreshGroup: boolean
  filterKeys: any[]
  projectInfoValues: any[]
  isUpdateMember: boolean
}

const initialState: CounterState = {
  projectInfo: {},
  workList: {
    list: undefined,
  },
  colorList: [
    { key: 'var(--primary-d2)', bgColor: '#F2F7FF' },
    { key: '#FF5C5E', bgColor: '#FCEEEE' },
    { key: '#43BA9A', bgColor: '#EDF7F4' },
    { key: '#FA9746', bgColor: '#FCF3EB' },
    { key: '#969799', bgColor: '#F2F2F4' },
    { key: '#8046FA', bgColor: '#F0EBFC' },
    { key: '#FA46E1', bgColor: '#FCEBFA' },
    { key: '#FF8B8B', bgColor: '#FCEBEB' },
    { key: '#269758', bgColor: '#EBFCF3' },
    { key: '#3AA7FF', bgColor: '#EBF4FC' },
    { key: '#00ADD2', bgColor: '#EBF9FC' },
    { key: '#ED7303', bgColor: '#FCF3EB' },
    { key: '#4D5EFF', bgColor: '#EBEDFC' },
    { key: '#464646', bgColor: '#EDEDED' },
  ],
  isChangeProject: 0,
  filterParamsModal: {},
  isRefreshGroup: false,
  filterKeys: [],
  projectInfoValues: [],
  isUpdateMember: false,
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // 全局使用项目信息
    setProjectInfo: (state: any, action) => {
      state.projectInfo = action.payload
    },
    // 关于项目的下拉数据
    setProjectInfoValues: (state: any, action) => {
      state.projectInfoValues = action.payload
    },
    // 用于工作流设置 -- 用于流转设置表格
    setWorkList: (state: any, action) => {
      state.workList = action.payload
    },
    // 项目详情头部切换项目使用 -- 用于是否更新项目信息
    setIsChangeProject: (state: any, action) => {
      state.isChangeProject = action.payload
    },
    // 筛选需求列表参数，用于回填创建需求弹窗
    setFilterParamsModal: (state: any, action) => {
      state.filterParamsModal = action.payload
    },
    // 是否更新分组列表，用于获取count
    setIsRefreshGroup: (state: any, action) => {
      state.isRefreshGroup = action.payload
    },
    // 需求列表筛选项值计数 -- 用于暂无数据优化显示
    setFilterKeys: (state: any, action) => {
      state.filterKeys = action.payload
    },
    // 是否更新项目成员 -- 用于成员弹窗操作后更新设置项目成员
    setIsUpdateMember: (state: any, action) => {
      state.isUpdateMember = action.payload
    },
  },
  extraReducers(builder) {
    //
  },
})

export const {
  setProjectInfo,
  setWorkList,
  setIsChangeProject,
  setFilterParamsModal,
  setIsRefreshGroup,
  setFilterKeys,
  setProjectInfoValues,
  setIsUpdateMember,
} = projectSlice.actions

export default projectSlice.reducer
