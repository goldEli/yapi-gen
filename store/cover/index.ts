import { createSlice } from '@reduxjs/toolkit'
import { getProjectCover } from './thunks'

type SliceState = {
  covers?: any
}

const slice = createSlice({
  name: 'cover',
  initialState: {
    covers: [],
  } as SliceState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getProjectCover.fulfilled, (state, action) => {
      state.covers = action.payload
    })
  },
})

export default slice.reducer
