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
  },
  extraReducers(builder) {},
})

const performanceInsight = slice.reducer

export const { setSave, setHeaderParmas, setProjectDataList } = slice.actions

export default performanceInsight
