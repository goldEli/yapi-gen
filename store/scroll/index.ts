import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  isRest: boolean
}

const slice = createSlice({
  name: 'scroll',
  initialState: {} as SliceState,
  reducers: {
    changeRestScroll: (state, action) => {
      state.isRest = action.payload
    },
  },

  //   extraReducers(builder) {},
})

export const { changeRestScroll } = slice.actions

export default slice.reducer
