/* eslint-disable no-duplicate-imports */
// mine
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getVerifyInfo } from '@/services/mine'

export interface CounterState {
  verifyInfo: any
  isUpdateCreate: boolean
}

const initialState: CounterState = {
  verifyInfo: null,
  isUpdateCreate: false,
}

// 异步请求外部数据

export const getAsyncVerifyInfo = createAsyncThunk(
  'nameSpace/getMine',
  async (params: any) => {
    const res = await getVerifyInfo(params)

    return res
  },
)

export const mineSlice = createSlice({
  name: 'mine',
  initialState,
  reducers: {
    setIsUpdateCreate: (state: any, action) => {
      state.isUpdateCreate = action.payload
    },
    setVerifyInfo: (state: any, action) => {
      state.verifyInfo = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getAsyncVerifyInfo.fulfilled, (state: any, action: any) => {
      state.verifyInfo = action.payload
    })
  },
})

export const { setIsUpdateCreate, setVerifyInfo } = mineSlice.actions

export default mineSlice.reducer
