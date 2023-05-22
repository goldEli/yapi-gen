/* eslint-disable max-lines */
/* eslint-disable no-undefined */
import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  save: boolean
}

const initialState: SliceState = {
  save: false,
}

const slice = createSlice({
  name: 'PerformanceInsight',
  initialState,
  reducers: {
    setSave: (state, action) => {
      state.save = action.payload
    },
  },
  extraReducers(builder) {},
})

const performanceInsight = slice.reducer

export const { setSave } = slice.actions

export default performanceInsight
