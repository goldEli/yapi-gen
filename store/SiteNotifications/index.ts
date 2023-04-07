import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  isVisible: boolean
  isVisibleFilter: boolean
}

const slice = createSlice({
  name: 'SiteNotifications',
  initialState: {} as SliceState,
  reducers: {
    changeVisible: (state, action) => {
      state.isVisible = action.payload
    },
    changeVisibleFilter: (state, action) => {
      state.isVisibleFilter = action.payload
    },
  },

  //   extraReducers(builder) {},
})

export const { changeVisible, changeVisibleFilter } = slice.actions

export default slice.reducer
