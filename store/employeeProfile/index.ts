import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getMemberOverviewList,
  getMemberOverviewStatistics,
} from './employeeProfile.thunk'

export interface CounterState {
  // 成员数组
  allMemberList: any[]
  // 统计数据
  memberStatistics: any
  // 当前选中的状态 - 默认为逾期
  currentKey: any
  // 查询的搜索值
  filterParams: any
}

const initialState: CounterState = {
  allMemberList: [],
  currentKey: {},
  memberStatistics: {},
  filterParams: {},
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
    setFilterParams: (state: any, action) => {
      state.filterParams = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getMemberOverviewList.fulfilled, (state, action) => {
      state.allMemberList = action.payload
    })
    builder.addCase(getMemberOverviewStatistics.fulfilled, (state, action) => {
      state.memberStatistics = action.payload
    })
  },
})

export const { setCurrentKey, setFilterParams } = employeeProfileSlice.actions

export default employeeProfileSlice.reducer
