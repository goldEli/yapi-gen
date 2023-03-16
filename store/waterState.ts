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

// 异步请求外部数据

export const getStatus = createAsyncThunk('nameSpace/getStatus', async () => {
  const res = await getWater()

  res.status = res.status === 1 ? true : false
  return res
})

export const counterSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    changeWaterStatus: (state, action) => {
      state.value = action.payload
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
