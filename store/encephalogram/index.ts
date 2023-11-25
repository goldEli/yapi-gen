/* eslint-disable no-undefined */
import { createSlice } from '@reduxjs/toolkit'

type SliceState = {
  data: any
  encephalogramParams: {
    // 迭代
    iterationVal: Array<number | string>
    // 任务状态
    state: Array<number | string>
    // 时间
    time: Array<number | string>
    // 项目人员
    person: Array<number | string>
    // 按人员/按任务
    group_by: string
  }
  loading: boolean
  extraParams: {
    // 刷新
    refresh: number
    // 放大缩小的
    num: number
    numType: string
  }
  extraInfo: any[]
  // 是否弹窗提示更新
  updateModal: {
    visible: boolean
    isShow: boolean
    projectId: number
  }
}

const initialState: SliceState = {
  encephalogramParams: {
    iterationVal: [],
    state: [],
    time: [],
    person: [],
    group_by: 'user',
  },
  extraParams: {
    num: 1,
    numType: '',
    refresh: 0,
  },
  loading: false,
  extraInfo: [],
  updateModal: {
    visible: false,
    isShow: false,
    projectId: 0,
  },
  data: { name: '', style: { fontSize: 18 } },
}

const slice = createSlice({
  name: 'encephalogram',
  initialState,
  reducers: {
    setData(state, action) {
      state.data = {
        ...action.payload,
      }
    },
    setEncephalogramParams(state, action) {
      state.encephalogramParams = {
        ...state.encephalogramParams,
        ...action.payload,
      }
    },
    setExtraParams(state, action) {
      state.extraParams = {
        ...state.extraParams,
        ...action.payload,
      }
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setExtraInfo(state, action) {
      state.extraInfo = action.payload
    },
    setUpdateModal(state, action) {
      state.updateModal = {
        ...state.updateModal,
        ...action.payload,
      }
    },
  },
})

const encephalogram = slice.reducer
export const {
  setData,
  setEncephalogramParams,
  setLoading,
  setExtraInfo,
  setExtraParams,
  setUpdateModal,
} = slice.actions

export default encephalogram
