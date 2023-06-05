/* eslint-disable no-undefined */
/* eslint-disable no-duplicate-imports */
// 项目
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getParentList } from './project.thunk'

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
  addWorkItemModal: {
    visible: boolean
    params?: Model.Project.AddWorkItemParams
  }
  addWorkItemParentList: any[]
  guideVisible: boolean
  addQuickSprintModal: {
    visible: boolean
    params?: Model.Project.AddQuickSprintParams
  }
  work_type?: number
  // 是否刷新评论
  isRefreshComment: boolean
  // 是否更新状态 -- 需求详情使用
  isUpdateStatus: boolean
  // 是否更新变更记录
  isUpdateChangeLog: boolean
  // 需求创建选择的需求类别
  createCategory: any
  // 过滤的参数
  filterParams: any
  // 创建需求成功后是否刷新
  isUpdateAddWorkItem: any
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
  addWorkItemModal: {
    visible: false,
    params: {},
  },
  addWorkItemParentList: [],
  guideVisible: false,
  addQuickSprintModal: {
    visible: false,
    params: {
      name: '',
      icon: 'https://dev.staryuntech.com/dev-agile/attachment/category_icon/message.png',
      parentName: '长故事',
      parentId: 0,
    },
  },
  // ---新
  isRefreshComment: false,
  isUpdateStatus: false,
  isUpdateChangeLog: false,
  createCategory: {},
  filterParams: {},
  isUpdateAddWorkItem: false,
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // 全局使用项目信息
    setProjectInfo: (state: any, action) => {
      console.log(' action.payload---', action.payload)
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
    setAddWorkItemModal(
      state,
      action: PayloadAction<CounterState['addWorkItemModal']>,
    ) {
      state.addWorkItemModal = {
        ...state.addWorkItemModal,
        ...action.payload,
      }
    },
    // 引导页弹窗
    onChangeGuideVisible(
      state,
      action: PayloadAction<CounterState['guideVisible']>,
    ) {
      state.guideVisible = action.payload
    },
    setAddQuickSprintModal(
      state,
      action: PayloadAction<CounterState['addQuickSprintModal']>,
    ) {
      state.addQuickSprintModal = {
        ...state.addQuickSprintModal,
        ...action.payload,
      }
    },
    setCategoryWorkType(state, action: PayloadAction<number>) {
      state.work_type = action.payload
    },
    // ---- 新
    // 需求主页选中的需求类别 -- 用于回填创建弹窗
    setCreateCategory: (state: any, action) => {
      state.createCategory = action.payload
    },
    // 更新评论列表 -- 用于流转成功后更新评论
    setIsRefreshComment: (state: any, action) => {
      state.isRefreshComment = action.payload
    },
    // 是否更新状态 -- 用于需求详情中更新状态
    setIsUpdateStatus: (state: any, action) => {
      state.isUpdateStatus = action.payload
    },
    // 是否更新变更记录 -- 用于需求详情中更新变更记录
    setIsUpdateChangeLog: (state: any, action) => {
      state.isUpdateChangeLog = action.payload
    },
    // 筛选需求列表参数，用于回填创建需求弹窗
    setFilterParams: (state: any, action) => {
      state.filterParams = action.payload
    },
    // 刷新需求
    setIsUpdateAddWorkItem: (state: any, action) => {
      state.isUpdateAddWorkItem = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getParentList.fulfilled, (state, action) => {
      state.addWorkItemParentList = action.payload
    })
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
  setAddWorkItemModal,
  onChangeGuideVisible,
  setAddQuickSprintModal,
  setCategoryWorkType,
  setIsRefreshComment,
  setIsUpdateStatus,
  setIsUpdateChangeLog,
  setCreateCategory,
  setFilterParams,
  setIsUpdateAddWorkItem,
} = projectSlice.actions

export default projectSlice.reducer
