import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'freed',
  initialState: {
    freedVisible: false,
  },
  reducers: {
    changeFreedVisibleVisible(state, action) {
      state.freedVisible = action.payload
    },
  },
})

export const { changeFreedVisibleVisible } = slice.actions
export default slice.reducer
