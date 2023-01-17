/* eslint-disable no-undefined */
/* eslint-disable no-duplicate-imports */
// 项目
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  projectInfo: any
  isUpdateCreate: boolean
}

const initialState: CounterState = {
  projectInfo: {},
  isUpdateCreate: false,
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectInfo: (state: any, action) => {
      state.projectInfo = action.payload
    },
  },
  extraReducers(builder) {
    //
  },
})

export const { setProjectInfo } = projectSlice.actions

export default projectSlice.reducer
