/* eslint-disable no-duplicate-imports */
// 员工详情
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getMainInfo } from '@/services/member'

export interface GlobalState {
  /**
   * 一级菜单是否折叠
   * */
  firstMenuCollapse: boolean

  /**
   * 二级菜单是否折叠
   * */
  secondaryMenuCollapse: boolean
}

const initialState: GlobalState = {
  firstMenuCollapse: false,
  secondaryMenuCollapse: false,
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setSecondaryMenuCollapse(preState: GlobalState, action) {
      preState.secondaryMenuCollapse = action.payload
    },
    setFirstMenuCollapse(preState: GlobalState, action) {
      preState.firstMenuCollapse = action.payload
    },
  },
  extraReducers: builder => {
    //
  },
})

export default globalSlice.reducer
