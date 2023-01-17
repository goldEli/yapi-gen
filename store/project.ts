/* eslint-disable no-undefined */
/* eslint-disable no-duplicate-imports */
// 项目
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  projectInfo: any
  workList: any
  isUpdateCreate: boolean
}

const initialState: CounterState = {
  projectInfo: {},
  workList: {
    list: undefined,
  },
  isUpdateCreate: false,
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectInfo: (state: any, action) => {
      state.projectInfo = action.payload
    },
    setWorkList: (state: any, action) => {
      state.workList = action.payload
    },
  },
  extraReducers(builder) {
    //
  },
})

export const { setProjectInfo, setWorkList } = projectSlice.actions

export default projectSlice.reducer
