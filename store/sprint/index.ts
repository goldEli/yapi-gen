import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getSprintList, getProjectRoleList } from './sprint.thunk'

type SliceState = {
  guideVisible: Model.Sprint.Visible
  sprintTableData: Model.Sprint.SprintTableData[]
  sprintDetailDrawer: {
    visible: boolean
    params?: any
  }
  projectRoleList?: Model.Sprint.ProjectSettings[]
}

const initialState: SliceState = {
  guideVisible: false,
  sprintTableData: [
    {
      id: '1',
      list: [
        {
          id: '11',
          name: '事务标题名称名称...',
          bh: 'DXKJ-221',
          long: '项目管理模块',
          zi: 3,
          user: '李钟硕',
          level: '低',
          status: '进行中',
        },
        {
          id: '12',
          name: '事务标题名称名称...',
          bh: 'DXKJ-222',
          long: '项目管理模块',
          zi: 3,
          user: '李钟硕',
          level: '低',
          status: '进行中',
        },
        {
          id: '13',
          name: '事务标题名称名称...',
          bh: 'DXKJ-223',
          long: '项目管理模块',
          zi: 3,
          user: '李钟硕',
          level: '低',
          status: '进行中',
        },
        {
          id: '14',
          name: '事务标题名称名称...',
          bh: 'DXKJ-224',
          long: '项目管理模块',
          zi: 3,
          user: '李钟硕',
          level: '低',
          status: '进行中',
        },
        {
          id: '15',
          name: '事务标题名称名称...',
          bh: 'DXKJ-225',
          long: '项目管理模块',
          zi: 3,
          user: '李钟硕',
          level: '低',
          status: '进行中',
        },
      ],
    },
    {
      id: '2',
      list: [
        {
          id: '21',
          name: '事务标题名称名称...',
          bh: 'DXKJ-21111',
          long: '项目管理模块',
          zi: 3,
          user: '李钟硕',
          level: '低',
          status: '进行中',
        },
        {
          id: '22',
          name: '事务标题名称名称...',
          bh: 'DXKJ-222222',
          long: '项目管理模块',
          zi: 3,
          user: '李钟硕',
          level: '低',
          status: '进行中',
        },
      ],
    },
  ],
  sprintDetailDrawer: {
    visible: false,
    params: {},
  },
}

const slice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    setGuideVisible(state, action: PayloadAction<SliceState['guideVisible']>) {
      state.guideVisible = action.payload
    },
    setSprintTableData(
      state,
      action: PayloadAction<SliceState['sprintTableData']>,
    ) {
      state.sprintTableData = action.payload
    },
    setSprintDetailDrawer(
      state,
      action: PayloadAction<SliceState['sprintDetailDrawer']>,
    ) {
      state.sprintDetailDrawer = {
        ...state.sprintDetailDrawer,
        ...action.payload,
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(getSprintList.fulfilled, (state, action) => {
      state.sprintTableData = action.payload
    })
    builder.addCase(getProjectRoleList.fulfilled, (state, action) => {
      console.log('action', action)
      state.projectRoleList = action.payload
    })
  },
})

const sprint = slice.reducer

export const { setGuideVisible, setSprintDetailDrawer, setSprintTableData } =
  slice.actions

export default sprint
