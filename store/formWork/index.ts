import { createSlice } from '@reduxjs/toolkit'
import { getTemplateList } from './thunk'

type SliceState = {
  // 编辑的状态
  editSave: boolean
  activeItem: any
  dataList: any
  option: any
}

const formWork = createSlice({
  name: 'formWork',
  initialState: {
    editSave: false,
    activeItem: null,
    option: [
      {
        type: 1,
        icon: 'user-more',
      },
      {
        type: 2,
        icon: 'attachment',
      },
      {
        type: 3,
        icon: 'text',
      },
      {
        type: 4,
        icon: 'horizontal',
      },
    ],
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
  },
  extraReducers(builder) {
    builder.addCase(getTemplateList.fulfilled, (state, action) => {
      const data = action.payload.list
      state.dataList = data
    })
  },
})

export const { setEditSave, setActiveItem } = formWork.actions

export default formWork.reducer
