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
    numType: ''
  },
}

const slice = createSlice({
  name: 'encephalogram',
  initialState,
  reducers: {
    setEncephalogramParmas(state, action) {
      state.encephalogramParams = {
        ...state.encephalogramParams,
        ...action.payload,
      }
    },
  },
})

const encephalogram = slice.reducer
export const { setEncephalogramParmas } = slice.actions

export default encephalogram
