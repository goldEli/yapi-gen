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
  createViewPort: {
    type: number
  }
}

const slice = createSlice({
  name: 'view',
  initialState: {
    searchChoose: {},
    searchKey: [],
    valueKey: {},
    titles: [],
    createVisible: false,
    viewVisible: false,
    createViewPort: {
      type: 0,
    },
  } as SliceState,
  reducers: {
    //打开创建视图管理弹窗
    changeCreateVisible: (state, action) => {
      state.createVisible = action.payload
    },
    //打开编辑视图弹窗
    changeViewVisible: (state, action) => {
      state.viewVisible = action.payload
    },
    // 给表格标题赋值
    onTapTitles: (state, action) => {
      state.tapTitles = action.payload
    },
    // 给搜索框赋值
    onTapInputKey: (state, action) => {
      state.tapInputKey = action.payload
    },
    //给表格排序赋值
    onTapSort: (state, action) => {
      state.tapSort = action.payload
    },
    //给筛选框赋值
    onTapSearchChoose: (state, action) => {
      state.searchChoose = action.payload
    },
    //操作是保存输入框的值
    saveInputKey: (state, action) => {
      state.inputKey = action.payload
    },
    // 操作时保存筛选框的值
    saveScreen: (state, action) => {
      state.searchKey = action.payload
    },
    saveValue: (state, action) => {
      state.valueKey = action.payload
    },
    // 操作时保存表格标题的值
    saveTitles: (state, action) => {
      state.titles = action.payload
    },
    // 操作时保存表格排序的值
    saveSort: (state, action) => {
      state.sort = action.payload
    },
    clearValue: state => {
      state.valueKey = {}
    },
    setCreateViewPort: (state, action) => {
      state.createViewPort = {
        ...state.createViewPort,
        ...action.payload,
      }
    },
  },

  extraReducers(builder) {
    builder.addCase(getViewList.fulfilled, (state, action) => {
      state.viewList = action.payload
    })
  },
})

export const {
  clearValue,
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
  setCreateViewPort,
} = slice.actions

export default slice.reducer
