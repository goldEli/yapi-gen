import { message } from 'antd'
import { createSlice } from '@reduxjs/toolkit'
import { postCreate, postEditCreate } from './thunks'

type SliceState = {
  createVisible: boolean
  isEditId: string
}

const slice = createSlice({
  name: 'createProject',
  initialState: {
    createVisible: false,
  } as SliceState,
  reducers: {
    changeCreateVisible: (state, action) => {
      state.createVisible = action.payload
      state.isEditId = ''
    },
    editProject: (state, action) => {
      state.createVisible = action.payload.visible
      state.isEditId = action.payload.id
    },
  },

  extraReducers(builder) {
    builder
      .addCase(postCreate.fulfilled, (state, action) => {
        message.success('创建成功')
        state.createVisible = false
      })
      .addCase(postEditCreate.fulfilled, (state, action) => {
        message.success('编辑成功')
        state.createVisible = false
        state.isEditId = ''
      })
  },
})

export const { changeCreateVisible, editProject } = slice.actions

export default slice.reducer
