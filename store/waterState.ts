/* eslint-disable no-duplicate-imports */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  value: number | string
}

const initialState: CounterState = {
  value: 1,
}

export const counterSlice = createSlice({
  name: 'water',
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
