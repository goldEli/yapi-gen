/* eslint-disable no-duplicate-imports */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { changeWater, getWater } from '@/services/setting'

export interface CounterState {
  value: number | string
}

const initialState: CounterState = {
  value: 2,
}

// 异步请求外部数据

export const getStatus = createAsyncThunk('nameSpace/getStatus', async () => {
  const res = await getWater()
  return res
})

export const counterSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    changeWaterStatus: (state, action: any) => {
      changeWater(action.payload)
      state.value = action.payload.status
    },
  },
  extraReducers(builder) {
    builder.addCase(getStatus.fulfilled, (state: any, action: any) => {
      state.value = action.payload.status
    })
  },
})

// Action creators are generated for each case reducer function
export const { changeWaterStatus } = counterSlice.actions

export default counterSlice.reducer
