import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'freed',
  initialState: {
    freedVisible: false,
  },
  reducers: {
    changeFreedVisibleVisible(state, action) {
      console.log(1111111111111, action.payload)
      state.freedVisible = action.payload
    },
  },
})

export const { changeFreedVisibleVisible } = slice.actions
export default slice.reducer
