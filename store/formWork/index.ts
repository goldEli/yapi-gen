import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  // 编辑的状态
  editSave: boolean
  activeItem: any
  // 权限配置的状态
  disposeSave: boolean
}

const formWork = createSlice({
  name: 'formWork',
  initialState: {
    editSave: true,
    activeItem: null,
    disposeSave: true,
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
})

export const { setEditSave, setActiveItem, setDisposeSave } = formWork.actions

export default formWork.reducer
