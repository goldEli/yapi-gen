import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getMemberOverviewList,
  getMemberOverviewStatistics,
} from './employeeProfile.thunk'

export interface CounterState {
  // 成员数组
  allMemberList: {
    id: number
    name: string
    avatar: string
  }[]
  // 统计数据
  memberStatistics: any
  // 当前选中的状态 - 默认为逾期
  currentKey: string
  // 查询的搜索值
  filterParams: any
}

const initialState: CounterState = {
  allMemberList: [
    {
      id: 707,
      name: '臧三',
      avatar: '',
    },
    {
      id: 712,
      name: '臧三1',
      avatar: 'https://agile-api.tke.staryuntech.com/attachment/bg_cover1.png',
    },
    {
      id: 1418,
      name: '臧三2',
      avatar: 'https://agile-api.tke.staryuntech.com/attachment/bg_cover2.png',
    },
    {
      id: 4,
      name: '臧三3',
      avatar: 'https://agile-api.tke.staryuntech.com/attachment/bg_cover3.png',
    },
  ],
  currentKey: 'overdue',
  memberStatistics: {
    all: {
      total: 3,
      user_ids: [707, 712, 1418],
    },
    completed: {
      total: 2,
      user_ids: [707, 1418],
    },
    un_start: {
      total: 0,
      user_ids: [],
    },
    start: {
      total: 1,
      user_ids: [1418],
    },
    overdue: {
      total: 2,
      user_ids: [707, 1418],
    },
  },
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
