/* eslint-disable no-undefined */
/* eslint-disable no-duplicate-imports */
// 项目
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  isUpdateCreate: boolean
}

const initialState: CounterState = {
  isUpdateCreate: false,
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // setProjectList: (state: any, action) => {
    //   state.projectList = action.payload
    // },
  },
  extraReducers(builder) {
    //
  },
})

// export const { setProjectList } = projectSlice.actions

export default projectSlice.reducer
