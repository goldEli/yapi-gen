import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  isVisible: boolean
}

const slice = createSlice({
  name: 'SiteNotifications',
  initialState: {} as SliceState,
  reducers: {
    changeVisible: (state, action) => {
      state.isVisible = action.payload
    },
  },

  //   extraReducers(builder) {},
})

export const { changeVisible } = slice.actions

export default slice.reducer
