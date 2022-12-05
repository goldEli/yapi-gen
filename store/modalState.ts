/* eslint-disable no-duplicate-imports */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  value: boolean
}

const initialState: CounterState = {
  value: false,
}

export const counterSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    changeId: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { changeId } = counterSlice.actions

export default counterSlice.reducer
