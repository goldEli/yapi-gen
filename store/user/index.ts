/* eslint-disable no-duplicate-imports */
import { createSlice } from '@reduxjs/toolkit'
import { getLoginDetail } from './user.thunk'

export interface CounterState {
  loginInfo: any
  userInfo: any
  isRefresh: boolean
}

const initialState: CounterState = {
  loginInfo: {},
  userInfo: {},
  isRefresh: false,
}

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getLoginDetail.fulfilled, (state, action) => {
      state.loginInfo = action.payload
    })
  },
})

export default counterSlice.reducer
