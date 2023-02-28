import { createSlice } from '@reduxjs/toolkit'
import { getViewList } from './thunk'

type SliceState = {
  screen: {
    key: any
    value: any
    choose: any
  }
  titles: any
  createVisible: boolean
  viewVisible: boolean
  viewList: any[]
  sort: any
}

const slice = createSlice({
  name: 'view',
  initialState: {
    screen: {
      key: [],
      value: [],
      choose: {},
    },
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
    saveScreen: (state, action) => {
      state.screen = {
        key: { ...state.screen.key, ...action.payload.key },
        value: { ...state.screen.value, ...action.payload.value },
        choose: { ...action.payload.choose },
      }
    },
    saveTitles: (state, action) => {
      state.titles = action.payload
    },
    saveSort: (state, action) => {
      state.sort = action.payload
    },
  },

  extraReducers(builder) {
    builder.addCase(getViewList.fulfilled, (state, action) => {
      state.viewList = action.payload
    })
  },
})

export const {
  changeCreateVisible,
  changeViewVisible,
  saveScreen,
  saveTitles,
  saveSort,
} = slice.actions

export default slice.reducer
