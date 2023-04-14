import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  isVisible: boolean
  isVisibleFilter: boolean
  configuration: any
  myConfiguration: any
  myEmailConfiguration: any
  emailConfiguration: any
}

const slice = createSlice({
  name: 'SiteNotifications',
  initialState: {
    configuration: [],
    myConfiguration: [],
    myEmailConfiguration: [],
  } as SliceState,
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
    setMyEmailConfiguration: (state, action) => {
      state.myEmailConfiguration = action.payload
    },
    setEmailConfiguration: (state, action) => {
      state.emailConfiguration = action.payload
    },
  },

  //   extraReducers(builder) {},
})

export const {
  changeVisible,
  changeVisibleFilter,
  setConfiguration,
  setMyConfiguration,
  setEmailConfiguration,
  setMyEmailConfiguration,
} = slice.actions

export default slice.reducer
