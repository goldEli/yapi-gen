/* eslint-disable no-undefined */
/* eslint-disable no-duplicate-imports */
// 项目
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import {
  getParentList,
  getProjectInfoStore,
  getProjectInfoValuesStore,
  getWarningConfigInfo,
} from './project.thunk'

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
    params?: Partial<Model.Affairs.AffairsInfo>
  }
  work_type?: number
  // 是否更新状态 -- 需求详情使用
  isUpdateStatus: boolean
  // 是否更新变更记录
  isUpdateChangeLog: boolean
  // 需求创建选择的需求类别
  createCategory: any
  // 过滤的参数
  filterParams: any
  // 创建需求成功后是否刷新
  isUpdateAddWorkItem: number

  // 事务-详情/浮层更新
  isChangeDetailAffairs: boolean
  // 详情的全屏弹窗
  isDetailScreenModal: {
    visible: boolean
    params: Model.Project.DetailScreenModalParams
  }
  // 浮层详情
  drawerInfo: any
  // 浮层是否可编辑
  drawerCanOperation: any
  tableFilter?: any
  updateProgress: number
  projectWarning?: any
  projectWarningModal?: {
    visible: boolean
    id?: number
  }
  statistiDepartment?: any
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
    params: {},
  },
  // ---新
  isUpdateStatus: false,
  isUpdateChangeLog: false,
  createCategory: {},
  filterParams: {},
  isUpdateAddWorkItem: 0,
  isChangeDetailAffairs: false,
  isDetailScreenModal: {
    visible: false,
    params: { id: 0 },
  },
  drawerInfo: {},
  drawerCanOperation: {},
  updateProgress: 0,
  projectWarning: {},
  statistiDepartment: {
    checkedKeys: [],
    list: [],
  },
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // 详情弹层
    setIsDetailScreenModal: (state: any, action) => {
      state.isDetailScreenModal = {
        ...state.isDetailScreenModal,
        ...action.payload,
      }
    },
    // 是否更新进度日志
    setUpdateProgress: (state: any, action) => {
      state.updateProgress = action.payload
    },
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
    setCategoryWorkType(state, action: PayloadAction<number>) {
      state.work_type = action.payload
    },
    // ---- 新
    // 需求主页选中的需求类别 -- 用于回填创建弹窗
    setCreateCategory: (state: any, action) => {
      state.createCategory = action.payload
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

    // 刷新子事务列表或者链接事务列表
    setIsChangeDetailAffairs: (state: any, action) => {
      state.isChangeDetailAffairs = action.payload
    },
    //存储浮层可操作的字段数据
    setDrawerCanOperation: (state: any, action) => {
      state.drawerCanOperation = action.payload
    },
    //存储浮层详情数据
    setDrawerInfo: (state: any, action) => {
      state.drawerInfo = action.payload
    },
    setTableFilter: (state: any, action) => {
      state.tableFilter = action.payload
    },
    setAddWorkItemParentList: (state: any, action) => {
      state.addWorkItemParentList = action.payload
    },
    setProjectWarning(
      state: any,
      action: PayloadAction<CounterState['projectWarning']>,
    ) {
      state.projectWarning = action.payload
    },
    setProjectWarningModal(
      state: any,
      action: PayloadAction<CounterState['projectWarningModal']>,
    ) {
      state.projectWarningModal = action.payload
    },
    setStatistiDepartment(
      state: any,
      action: PayloadAction<CounterState['statistiDepartment']>,
    ) {
      state.statistiDepartment = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getParentList.fulfilled, (state, action) => {
      state.addWorkItemParentList = action.payload
    })
    builder.addCase(getProjectInfoValuesStore.fulfilled, (state, action) => {
      state.projectInfoValues = action.payload
    })
    builder.addCase(getProjectInfoStore.fulfilled, (state, action) => {
      state.projectInfo = action.payload
    })
    builder.addCase(getWarningConfigInfo.fulfilled, (state, action) => {
      const res = action.payload
      const { push_date } = res ?? {}
      const { day = [], is_holiday } = push_date
      state.projectWarning = {
        ...res,
        push_date: {
          ...push_date,
          day: is_holiday === 1 ? [...day, -1] : [...day],
        },
      }
    })
  },
})

export const {
  setIsDetailScreenModal,
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
  setCategoryWorkType,
  setIsUpdateStatus,
  setIsUpdateChangeLog,
  setCreateCategory,
  setFilterParams,
  setIsUpdateAddWorkItem,
  setIsChangeDetailAffairs,
  setDrawerCanOperation,
  setTableFilter,
  setAddWorkItemParentList,
  setDrawerInfo,
  setUpdateProgress,
  setProjectWarning,
  setProjectWarningModal,
  setStatistiDepartment,
} = projectSlice.actions

export default projectSlice.reducer
