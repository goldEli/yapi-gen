import { createSlice } from '@reduxjs/toolkit'
import { getViewList } from './thunk'

type SliceState = {
  searchKey: any
  valueKey: any
  searchChoose: any
  tapTitles: any
  titles: any
  createVisible: boolean
  viewVisible: boolean
  viewList: any[]
  sort: any
  tapSort: any
}

const slice = createSlice({
  name: 'view',
  initialState: {
    searchKey: [],
    valueKey: {},
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
    onTapTitles: (state, action) => {
      state.tapTitles = action.payload
    },
    onTapSort: (state, action) => {
      state.tapSort = action.payload
    },
    onTapSearchChoose: (state, action) => {
      state.searchChoose = action.payload
    },
    saveScreen: (state, action) => {
      state.searchKey = action.payload
    },
    saveValue: (state, action) => {
      state.valueKey = action.payload
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
  onTapTitles,
  onTapSearchChoose,
  saveValue,
  onTapSort,
} = slice.actions

export default slice.reducer
