import { message } from 'antd'
import { createSlice } from '@reduxjs/toolkit'
import { postCreate, postEditCreate } from './thunks'

type SliceState = {
  createVisible: boolean
  isRest: boolean
  isEditId: string
  groupId: any
  typeId: any
  projectType: string
}

const slice = createSlice({
  name: 'createProject',
  initialState: {
    createVisible: true,
    isRest: false,
    typeId: 0,
    projectType: '',
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
    onRest: (state, action) => {
      state.isRest = action.payload
    },
    changeGroupId: (state, action) => {
      state.groupId = action.payload
    },
    changeTypeId: (state, action) => {
      state.typeId = action.payload
    },
    setProjectType: (state, action) => {
      state.projectType = action.payload
    },
  },

  extraReducers(builder) {
    builder
      .addCase(postCreate.fulfilled, (state, action) => {
        if (action.payload.code === 0) {
          state.createVisible = false
        }
      })
      .addCase(postEditCreate.fulfilled, (state, action) => {
        if (action.payload.code === 0) {
          state.createVisible = false
          state.isEditId = ''
        }
      })
  },
})

export const {
  changeCreateVisible,
  editProject,
  onRest,
  changeGroupId,
  changeTypeId,
  setProjectType,
} = slice.actions

export default slice.reducer
