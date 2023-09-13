/* eslint-disable max-lines */
/* eslint-disable no-undefined */
import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  save: boolean
  headerParmas: Models.Efficiency.HeaderParmas
  projectDataList: Array<{ name: string; id: number }>
  visiblePerson: boolean
  visibleWork: boolean
  viewType: number
}

const initialState: SliceState = {
  save: false,
  viewType: 0,
  headerParmas: {
    iterate_ids: [],
    projectIds: [],
    users: [],
    time: {
      type: 1,
      time: '',
    },
    view: {
      title: '',
      value: 0,
    },
    period_time: 'one_month',
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
    setViewType: (state, action) => {
      state.viewType = action.payload
    },
    setHeaderParmas: (state, action) => {
      state.headerParmas = { ...state.headerParmas, ...action.payload }
    },
    setProjectDataList: (state, action) => {
      state.projectDataList = action.payload
    },
    setVisiblePerson: (state, action) => {
      state.visiblePerson = action.payload
    },
    setVisibleWork: (state, action) => {
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
  setViewType,
} = slice.actions

export default performanceInsight
