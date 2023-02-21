import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  screen?: any
  titles?: any
  createVisible: boolean
}

const slice = createSlice({
  name: 'cover',
  initialState: {
    screen: [],
    titles: [],
    createVisible: false,
  } as SliceState,
  reducers: {
    changeCreateVisible: (state, action) => {
      state.createVisible = action.payload
    },
  },

  //   extraReducers(builder) {},
})

export const { changeCreateVisible } = slice.actions

export default slice.reducer
