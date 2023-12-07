import { createSlice } from '@reduxjs/toolkit'
import { getMemberOverviewList } from './employeeProfile.thunk'

export interface CounterState {
  // 成员数组
  allMemberList: any[]
  // 当前选中的状态 - 默认为逾期
  currentKey: any
  // 查询的搜索值
  filterParamsOverall: any
  // 对比报告
  contrastDrawer: {
    visible: false
    params: any
  }
  // 打开浮层后标星或取消标星，更新数据使用
  taskDrawerUpdate: {
    id: number
    detailId: number
    state: number
  }
  // 筛选条件变化
  currentClickNumber?: any
}

const initialState: CounterState = {
  allMemberList: [],
  currentKey: {},
  filterParamsOverall: {
    status: 1,
  },
  contrastDrawer: {
    visible: false,
    params: {},
  },
  taskDrawerUpdate: {
    id: 0,
    detailId: 0,
    state: 0,
  },
  currentClickNumber: 0,
}

export const employeeProfileSlice = createSlice({
  name: 'employeeProfile',
  initialState,
  reducers: {
    // 更新当前选中卡片key
    setCurrentKey: (state: any, action) => {
      state.currentKey = action.payload
    },
    // 存储筛选条件
    setFilterParamsOverall: (state: any, action) => {
      state.filterParamsOverall = action.payload
    },
    // 对比报告
    setContrastDrawer: (state: any, action) => {
      state.contrastDrawer = action.payload
    },
    // 对比报告
    setTaskDrawerUpdate: (state: any, action) => {
      state.taskDrawerUpdate = action.payload
    },
    // 修改查询条件
    setCurrentClickNumber: (state: any, action) => {
      state.currentClickNumber = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getMemberOverviewList.fulfilled, (state, action) => {
      state.allMemberList = action.payload
    })
  },
})

export const {
  setCurrentKey,
  setFilterParamsOverall,
  setContrastDrawer,
  setTaskDrawerUpdate,
  setCurrentClickNumber,
} = employeeProfileSlice.actions

export default employeeProfileSlice.reducer
