/* eslint-disable no-undefined */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  getSprintKanBanList,
  getProjectRoleList,
  getSprintList,
  getSprintInfo,
  getSprintCommentList,
  getRightSprintList,
  getLeftSprintList,
} from './sprint.thunk'

type SliceState = {
  guideVisible: Model.Sprint.Visible
  sprintTableData: Model.Sprint.SprintTableData[]
  sprintDetailDrawer: {
    visible: boolean
    params?: any
  }
  projectRoleList?: Model.Sprint.ProjectSettings[]
  sprintInfo: Partial<Model.Sprint.SprintInfo>
  sprintCommentList: {
    list: Model.Sprint.CommentListInfo[]
  }
  // // 事务列表
  // sprintList: {
  //   list?: Model.Sprint.ListItem[]
  //   total?: number
  //   pageSize?: number
  //   currentPage?: number
  // }
  rightSprintList: any[]
  rightLoading: boolean
  leftSprintList: {
    list: any[]
    unassigned_count: number
  }
  leftLoading: boolean
  checkList: boolean[]
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
  // 事务详情
  sprintInfo: {},
  // 事务列表
  sprintCommentList: {
    list: [],
  },
  // sprintList: {
  //   list: undefined,
  // },
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
    setSprintInfo(state, action: PayloadAction<SliceState['sprintInfo']>) {
      state.sprintInfo = action.payload
    },
    setSprintCommentList(
      state,
      action: PayloadAction<SliceState['sprintCommentList']>,
    ) {
      state.sprintCommentList = action.payload
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
      state.leftSprintList = {
        ...state.leftSprintList,
        ...action.payload,
      }
    },
    setCheckList(state, action: PayloadAction<SliceState['checkList']>) {
      state.checkList = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getSprintKanBanList.fulfilled, (state, action) => {
      state.sprintTableData = action.payload
    })
    // builder.addCase(getSprintList.fulfilled, (state, action) => {
    //   state.sprintList = action.payload
    // })
    builder.addCase(getSprintInfo.fulfilled, (state, action) => {
      state.sprintInfo = action.payload
    })
    builder.addCase(getSprintCommentList.fulfilled, (state, action) => {
      state.sprintCommentList = action.payload
    })
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
  },
})

const sprint = slice.reducer

export const {
  setGuideVisible,
  setSprintDetailDrawer,
  setSprintTableData,
  setSprintInfo,
  setSprintCommentList,
  // setSprintList,
  setRightSprintList,
  setLeftSprintList,
  setCheckList,
} = slice.actions

export default sprint
