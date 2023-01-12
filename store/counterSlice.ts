/* eslint-disable no-duplicate-imports */
// 树状态
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  value: number | string
}

const initialState: CounterState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    changeId: (state, action: PayloadAction<number | string>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { changeId } = counterSlice.actions

export default counterSlice.reducer
