import { createSlice } from '@reduxjs/toolkit'
import { getTemplateList } from './thunk'

type SliceState = {
  // 编辑的状态
  editSave: boolean
  activeItem: any
  // 权限配置的状态
  disposeSave: boolean
  dataList: any
}

const formWork = createSlice({
  name: 'formWork',
  initialState: {
    editSave: true,
    activeItem: null,
    disposeSave: true,
    dataList: [
      {
        name: 123,
        id: 1,
      },
    ],
  } as SliceState,
  reducers: {
    // 是否保存
    setEditSave: (state: any, action) => {
      state.editSave = action.payload
    },
    // 当前选中的
    setActiveItem: (state: any, action) => {
      state.activeItem = action.payload
    },
    setDisposeSave: (state: any, action) => {
      state.disposeSave = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getTemplateList.fulfilled, (state, action) => {
      const data = action.payload.list
      state.dataList = data
    })
  },
})

export const { setEditSave, setActiveItem, setDisposeSave } = formWork.actions

export default formWork.reducer
