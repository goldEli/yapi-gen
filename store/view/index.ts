import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  screen?: any
  titles?: any
  createVisible: boolean
  viewVisible: boolean
}

const slice = createSlice({
  name: 'view',
  initialState: {
    screen: [],
    titles: [],
    createVisible: false,
    viewVisible: false,
  } as SliceState,
  reducers: {
    changeCreateVisible: (state, action) => {
      state.createVisible = action.payload
    },
    changeViewVisible: (state, action) => {
      state.viewVisible = action.payload
    },
  },

  //   extraReducers(builder) {},
})

export const { changeCreateVisible, changeViewVisible } = slice.actions

export default slice.reducer
