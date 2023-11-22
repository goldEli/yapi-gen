/* eslint-disable no-undefined */
import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  encephalogramParmas: {
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
  }
}

const initialState: SliceState = {
  encephalogramParmas: {
    iterationVal: [],
    state: [],
    time: [],
    person: [],
    group_by: 'user',
    refresh: 0,
  },
}

const slice = createSlice({
  name: 'encephalogram',
  initialState,
  reducers: {
    setEncephalogramParmas(state, action) {
      state.encephalogramParmas = {
        ...state.encephalogramParmas,
        ...action.payload,
      }
    },
  },
})

const encephalogram = slice.reducer
export const { setEncephalogramParmas } = slice.actions

export default encephalogram
