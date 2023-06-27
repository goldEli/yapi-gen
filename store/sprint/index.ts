/* eslint-disable no-undefined */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  getSprintKanBanList,
  getProjectRoleList,
  getRightSprintList,
  getLeftSprintList,
  getLongStoryList,
} from './sprint.thunk'

type SliceState = {
  guideVisible: Model.Sprint.Visible
  projectRoleList?: Model.Sprint.ProjectSettings[]

  rightSprintList: any[]
  rightLoading: boolean
  leftSprintList: {
    list: any[]
    unassigned_count: number
  }
  leftLoading: boolean
  checkList: boolean[]
  longStoryList: Model.Sprint.LongStory
  sprintRefresh: number
  sprintRightListRefresh: number
}

const initialState: SliceState = {
  guideVisible: false,
  // 冲刺页面右边的列表数据
  rightSprintList: [],
  rightLoading: false,
  // 冲刺页面左边的列表数据
  leftSprintList: {
    list: [],
    unassigned_count: 0,
  },
  leftLoading: false,
  checkList: [],
  longStoryList: {
    list: [],
  },
  sprintRefresh: 0,
  sprintRightListRefresh: 0,
}

const slice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    setGuideVisible(state, action: PayloadAction<SliceState['guideVisible']>) {
      state.guideVisible = action.payload
    },
    setRightSprintList(
      state,
      action: PayloadAction<SliceState['rightSprintList']>,
    ) {
      state.rightSprintList = action.payload
    },
    setLeftSprintList(
      state,
      action: PayloadAction<SliceState['leftSprintList']>,
    ) {
      state.leftSprintList = { ...action.payload }
    },
    setCheckList(state, action: PayloadAction<SliceState['checkList']>) {
      state.checkList = action.payload
    },
    setSprintRefresh(
      state,
      action: PayloadAction<SliceState['sprintRefresh']>,
    ) {
      state.sprintRefresh = action.payload + state.sprintRefresh
    },
    setSprintRightListRefresh(
      state,
      action: PayloadAction<SliceState['sprintRefresh']>,
    ) {
      state.sprintRightListRefresh =
        action.payload + state.sprintRightListRefresh
    },
  },
  extraReducers(builder) {
    builder.addCase(getProjectRoleList.fulfilled, (state, action) => {
      state.projectRoleList = action.payload
    })
    builder.addCase(getRightSprintList.pending, state => {
      state.rightLoading = true
    })
    builder.addCase(getRightSprintList.fulfilled, (state, action) => {
      state.rightSprintList = action.payload
      state.rightLoading = false
    })
    builder.addCase(getRightSprintList.rejected, state => {
      state.rightLoading = false
    })
    builder.addCase(getLeftSprintList.fulfilled, (state, action) => {
      state.leftSprintList = action.payload
      state.checkList = new Array(action.payload?.list?.length).fill(true)
      state.leftLoading = false
    })
    builder.addCase(getLeftSprintList.pending, state => {
      state.leftLoading = true
    })
    builder.addCase(getLeftSprintList.rejected, state => {
      state.leftLoading = false
    })
    builder.addCase(getLongStoryList.fulfilled, (state, action) => {
      state.longStoryList = action.payload
    })
  },
})

const sprint = slice.reducer

export const {
  setGuideVisible,
  setRightSprintList,
  setLeftSprintList,
  setCheckList,
  setSprintRefresh,
  setSprintRightListRefresh,
} = slice.actions

export default sprint
