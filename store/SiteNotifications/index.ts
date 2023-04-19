import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  all: number
  now: number
  friendUsername: string
  isVisible: boolean
  isVisibleFilter: boolean
  configuration: any
  myConfiguration: any
  myEmailConfiguration: any
  emailConfiguration: any
  msgType: any
}

const slice = createSlice({
  name: 'SiteNotifications',
  initialState: {
    all: 0,
    configuration: [],
    myConfiguration: [],
    myEmailConfiguration: [],
    friendUsername: 'project',
    msgType: [],
  } as SliceState,
  reducers: {
    changeNumber: (state, action) => {
      state.all = action.payload
    },
    changeNow: (state, action) => {
      state.now = action.payload
    },
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
  changeNumber,
  changeVisible,
  changeVisibleFilter,
  setConfiguration,
  setMyConfiguration,
  setEmailConfiguration,
  setMyEmailConfiguration,
} = slice.actions

export default slice.reducer
