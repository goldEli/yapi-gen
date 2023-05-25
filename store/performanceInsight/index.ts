/* eslint-disable max-lines */
/* eslint-disable no-undefined */
import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  save: boolean
  headerParmas: {
    projectIds: number[]
    users: []
    time: {
      type: number
      time: string[] | ''
    }
    view: {
      title: string
      value: number
    }
  }
  projectDataList: Array<{ name: string; id: number }>
  visiblePerson: boolean
  visibleWork: boolean
}

const initialState: SliceState = {
  save: false,
  headerParmas: {
    projectIds: [],
    users: [],
    time: {
      type: -1,
      time: '',
    },
    view: {
      title: '',
      value: 0,
    },
  },
  projectDataList: [],
  visiblePerson: false,
  visibleWork: false,
}

const slice = createSlice({
  name: 'PerformanceInsight',
  initialState,
  reducers: {
    setSave: (state, action) => {
      state.save = action.payload
    },
    setHeaderParmas: (state, action) => {
      state.headerParmas = action.payload
    },
    setProjectDataList: (state, action) => {
      state.projectDataList = action.payload
    },
    setVisiblePerson: (state, action) => {
      console.log(action.payload, 'action.payload')
      state.visiblePerson = action.payload
    },
    setVisibleWork: (state, action) => {
      console.log(action.payload, 'action.payload')
      state.visibleWork = action.payload
    },
  },
  extraReducers(builder) {},
})

const performanceInsight = slice.reducer

export const {
  setSave,
  setHeaderParmas,
  setProjectDataList,
  setVisiblePerson,
  setVisibleWork,
} = slice.actions

export default performanceInsight
