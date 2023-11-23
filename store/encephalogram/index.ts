/* eslint-disable no-undefined */
import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  encephalogramParams: {
    // 迭代
    iterationVal: Array<number | string>
    // 任务状态
    state: Array<number | string>
    // 时间
    time: Array<number | string>
    // 项目人员
    person: Array<number | string>
    // 按人员/按任务
    group_by: string
    // 刷新
    refresh: number
    // 放大缩小的
    num: number
    numType: string
  }
  loading: boolean
  extraInfo: any[]
}

const initialState: SliceState = {
  encephalogramParams: {
    iterationVal: [],
    state: [],
    time: [],
    person: [],
    group_by: 'user',
    refresh: 0,
    num: 1,
    numType: '',
  },
  loading: false,
  extraInfo: [],
}

const slice = createSlice({
  name: 'encephalogram',
  initialState,
  reducers: {
    setEncephalogramParams(state, action) {
      state.encephalogramParams = {
        ...state.encephalogramParams,
        ...action.payload,
      }
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setExtraInfo(state, action) {
      state.extraInfo = action.payload
    },
  },
})

const encephalogram = slice.reducer
export const { setEncephalogramParams, setLoading, setExtraInfo } =
  slice.actions

export default encephalogram
