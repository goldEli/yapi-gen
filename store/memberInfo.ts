/* eslint-disable no-duplicate-imports */
// 员工详情
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getMainInfo } from '@/services/memberInfo'

export interface CounterState {
  mainInfo: any
}

const initialState: CounterState = {
  mainInfo: null,
}

// 异步请求外部数据

export const getAsyncMember = createAsyncThunk(
  'nameSpace/getMember',
  async (params: any) => {
    const res = await getMainInfo(params)
    return res
  },
)

export const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAsyncMember.fulfilled, (state: any, action: any) => {
      state.mainInfo = action.payload
    })
  },
})

export default memberSlice.reducer
