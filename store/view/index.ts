import { createSlice } from '@reduxjs/toolkit'
import { getViewList } from './thunk'

type SliceState = {
  inputKey: any
  tapInputKey: any
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
    onTapInputKey: (state, action) => {
      state.tapInputKey = action.payload
    },
    onTapSort: (state, action) => {
      state.tapSort = action.payload
    },
    onTapSearchChoose: (state, action) => {
      state.searchChoose = action.payload
    },
    saveInputKey: (state, action) => {
      state.inputKey = action.payload
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
  onTapInputKey,
  changeCreateVisible,
  changeViewVisible,
  saveScreen,
  saveTitles,
  saveSort,
  onTapTitles,
  onTapSearchChoose,
  saveValue,
  onTapSort,
  saveInputKey,
} = slice.actions

export default slice.reducer
