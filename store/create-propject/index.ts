import { message } from 'antd'
import { createSlice } from '@reduxjs/toolkit'
import { postCreate, postEditCreate, getProjectRole } from './thunks'

type SliceState = {
  createVisible: boolean
  isRest: boolean
  isEditId: string
  groupId: any
  groupIdName: any
  typeId: any
  projectType: string
  projectRoleList?: any
}

const slice = createSlice({
  name: 'createProject',
  initialState: {
    createVisible: false,
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
    changeGroupIdName: (state, action) => {
      state.groupIdName = action.payload
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
      .addCase(getProjectRole.fulfilled, (state, action) => {
        state.projectRoleList = state
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
  changeGroupIdName,
} = slice.actions

export default slice.reducer
