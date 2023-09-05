/* eslint-disable no-duplicate-imports */
// 需求
import { createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  // 查看汇报抽屉
  viewReportModal: {
    visible: boolean
    id: number
    ids: number[]
    type?: number
  }
  writeReportModal: {
    visible: boolean
  }
  listUpdate: {
    isFresh: number
  }
  projectGroup: any
}

const initialState: CounterState = {
  viewReportModal: {
    visible: false,
    id: 0,
    ids: [],
  },
  writeReportModal: {
    visible: false,
  },
  listUpdate: {
    isFresh: 0,
  },
  projectGroup: [],
}

export const demandSlice = createSlice({
  name: 'demand',
  initialState,
  reducers: {
    // 启用状态
    setViewReportModal: (state: any, action) => {
      state.viewReportModal = {
        ...state.viewReportModal,
        ...action.payload,
      }
    },
    // 启动最近的汇报列表modal
    setWriteReportModal: (state: any, action) => {
      state.writeReportModal = {
        ...state.writeReportModal,
        ...action.payload,
      }
    },
    setUpdateList: (state: any, action) => {
      state.listUpdate = {
        ...state.listUpdate,
        isFresh: action.payload ? state.listUpdate.isFresh + 1 : 0,
      }
    },
    setProjectGroup: (state: any, action) => {
      state.projectGroup = action.payload
    },
  },
  // extraReducers(builder) {
  // },
})

export const {
  setViewReportModal,
  setWriteReportModal,
  setUpdateList,
  setProjectGroup,
} = demandSlice.actions

export default demandSlice.reducer
