import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  isRest: boolean
}

const slice = createSlice({
  name: 'logText',
  initialState: {} as SliceState,
  reducers: {
    changeRest: (state, action) => {
      state.isRest = action.payload
    },
  },

  //   extraReducers(builder) {},
})

export const { changeRest } = slice.actions

export default slice.reducer
