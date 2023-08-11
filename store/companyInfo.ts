/* eslint-disable no-duplicate-imports */
// 公司信息
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCompanyInfo } from '@/services/setting'
import normalCompany from 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/normalCompany.jpg'

export interface CounterState {
  value: any
}

const initialState: CounterState = {
  value: null,
}

// 异步请求外部数据

export const getAsyncCompanyInfo = createAsyncThunk(
  'nameSpace/getCompanyInfo',
  async () => {
    const res = await getCompanyInfo()

    res.logo = res.logo?.length > 0 ? res.logo : normalCompany
    return res
  },
)

export const companyInfoSlice = createSlice({
  name: 'companyInfo',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      getAsyncCompanyInfo.fulfilled,
      (state: any, action: any) => {
        state.value = action.payload
      },
    )
  },
})

export default companyInfoSlice.reducer
