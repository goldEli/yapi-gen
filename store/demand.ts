/* eslint-disable no-duplicate-imports */
// mine
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  demandInfo: any
  isUpdateCreate: boolean
}

const initialState: CounterState = {
  demandInfo: {},
  isUpdateCreate: false,
}

export const demandSlice = createSlice({
  name: 'demand',
  initialState,
  reducers: {
    // 需求详情
    setDemandInfo: (state: any, action) => {
      state.demandInfo = action.payload
    },
  },
  extraReducers(builder) {
    //
  },
})

export const { setDemandInfo } = demandSlice.actions

export default demandSlice.reducer
