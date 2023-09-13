/* eslint-disable no-undefined */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getAffairsInfo, getAffairsCommentList } from './affairs.thunk'

type SliceState = {
  affairsDetailDrawer: {
    visible: boolean
    params?: any
  }
  affairsInfo: Partial<Model.Affairs.AffairsInfo>
  affairsCommentList: {
    list: Model.Affairs.CommentListInfo[]
  }
  affairsActivity: string
}

const initialState: SliceState = {
  affairsDetailDrawer: {
    visible: false,
    params: {},
  },
  // 事务详情
  affairsInfo: {},
  // 事务列表
  affairsCommentList: {
    list: [],
  },
  // 事务详情-活动tab
  affairsActivity: '1',
}

const slice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    setAffairsDetailDrawer(
      state,
      action: PayloadAction<SliceState['affairsDetailDrawer']>,
    ) {
      state.affairsDetailDrawer = {
        ...state.affairsDetailDrawer,
        ...action.payload,
      }
    },
    setAffairsInfo(state, action: PayloadAction<SliceState['affairsInfo']>) {
      state.affairsInfo = action.payload
    },
    setAffairsCommentList(
      state,
      action: PayloadAction<SliceState['affairsCommentList']>,
    ) {
      state.affairsCommentList = action.payload
    },
    setAffairsActivity(
      state,
      action: PayloadAction<SliceState['affairsActivity']>,
    ) {
      state.affairsActivity = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getAffairsInfo.fulfilled, (state, action) => {
      state.affairsInfo = action.payload
    })
    builder.addCase(getAffairsCommentList.fulfilled, (state, action) => {
      state.affairsCommentList = action.payload
    })
  },
})

const sprint = slice.reducer

export const {
  setAffairsDetailDrawer,
  setAffairsInfo,
  setAffairsCommentList,
  setAffairsActivity,
} = slice.actions

export default sprint
