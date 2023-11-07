/* eslint-disable no-duplicate-imports */
// 水印状态
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getWater } from '@/services/setting'

export interface CounterState {
  value: boolean
}

const initialState: CounterState = {
  value: false,
}

export const counterSlice = createSlice({
  name: 'Forewarn',
  initialState,
  reducers: {
    changeWaterForewarnStatus: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { changeWaterForewarnStatus } = counterSlice.actions

export default counterSlice.reducer
