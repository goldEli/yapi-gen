import { message } from 'antd'
import { createSlice } from '@reduxjs/toolkit'
import { postCreate } from './thunks'

type SliceState = {
  createVisible: boolean
}

const slice = createSlice({
  name: 'createProject',
  initialState: {
    createVisible: false,
  } as SliceState,
  reducers: {
    changeCreateVisible: (state, action) => {
      state.createVisible = action.payload
    },
  },

  extraReducers(builder) {
    builder.addCase(postCreate.fulfilled, (state, action) => {
      message.success('创建成功')
      state.createVisible = false
    })
  },
})

export const { changeCreateVisible } = slice.actions

export default slice.reducer
