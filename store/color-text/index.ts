import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  text: string
}

const slice = createSlice({
  name: 'colorText',
  initialState: {} as SliceState,
  reducers: {
    changeColorText: (state, action) => {
      state.text = action.payload
    },
  },

  //   extraReducers(builder) {},
})

export const { changeColorText } = slice.actions

export default slice.reducer
