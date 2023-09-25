/* eslint-disable no-undefined */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getFlawInfo, getFlawCommentList } from './flaw.thunk'

type SliceState = {
  flawDetailDrawer: {
    visible: boolean
    params?: any
    isPreview?: boolean
    star?: boolean
  }
  flawInfo: Partial<Model.Flaw.FlawInfo>
  flawCommentList: {
    list: Model.Flaw.CommentListInfo[]
  }
}

const initialState: SliceState = {
  flawDetailDrawer: {
    visible: false,
    params: {},
    isPreview: false,
    star: false,
  },
  // 事务详情
  flawInfo: {},
  // 事务列表
  flawCommentList: {
    list: [],
  },
}

const slice = createSlice({
  name: 'flaw',
  initialState,
  reducers: {
    setFlawDetailDrawer(
      state,
      action: PayloadAction<SliceState['flawDetailDrawer']>,
    ) {
      state.flawDetailDrawer = {
        ...state.flawDetailDrawer,
        ...action.payload,
      }
    },
    setFlawInfo(state, action: PayloadAction<SliceState['flawInfo']>) {
      state.flawInfo = action.payload
    },
    setFlawCommentList(
      state,
      action: PayloadAction<SliceState['flawCommentList']>,
    ) {
      state.flawCommentList = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getFlawInfo.fulfilled, (state, action) => {
      state.flawInfo = action.payload
    })
    builder.addCase(getFlawCommentList.fulfilled, (state, action) => {
      state.flawCommentList = action.payload
    })
  },
})

const sprint = slice.reducer

export const { setFlawDetailDrawer, setFlawInfo, setFlawCommentList } =
  slice.actions

export default sprint
