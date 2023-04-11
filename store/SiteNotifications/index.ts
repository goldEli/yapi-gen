import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  isVisible: boolean
  isVisibleFilter: boolean
  configuration: any
  myConfiguration: any
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
    setConfiguration: (state, action) => {
      state.configuration = action.payload
    },
    setMyConfiguration: (state, action) => {
      state.myConfiguration = action.payload
    },
  },

  //   extraReducers(builder) {},
})

export const {
  changeVisible,
  changeVisibleFilter,
  setConfiguration,
  setMyConfiguration,
} = slice.actions

export default slice.reducer
