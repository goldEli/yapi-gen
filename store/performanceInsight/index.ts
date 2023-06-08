/* eslint-disable max-lines */
/* eslint-disable no-undefined */
import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  save: boolean
  headerParmas: Models.Efficiency.HeaderParmas
  projectDataList: Array<{ name: string; id: number }>
  visiblePerson: boolean
  visibleWork: boolean
}

const initialState: SliceState = {
  save: false,
  headerParmas: {
    iterate_ids: [],
    projectIds: [],
    users: [],
    time: {
      type: -1,
      time: undefined,
    },
    view: {
      title: '',
      value: 0,
    },
    period_time: 'four_week',
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
      state.headerParmas = { ...initialState.headerParmas, ...action.payload }
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
} = slice.actions

export default performanceInsight
