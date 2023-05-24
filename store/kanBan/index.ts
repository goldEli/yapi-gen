import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { kanbanInfo, kanbanInfoByGroup, kanbanConfig } from './data'

type SliceState = {
  guideVisible: Model.KanBan.guideVisible
  sortByGroupOptions?: Model.KanBan.GroupInfoItem[]
  sortByRowAndStatusOptions?: Model.KanBan.ViewItem[]
  sortByView?: Model.KanBan.ViewItem[]
  saveAsViewModelInfo: {
    visible: boolean
    viewItem?: Model.KanBan.ViewItem
  }
  shareModelInfo: {
    visible: boolean
  }
  kanbanInfo: Model.KanBan.Column[]
  kanbanInfoByGroup: Model.KanBan.Group[]
  kanbanConfig?: Model.KanbanConfig.Config
}

const initialState: SliceState = {
  kanbanConfig: kanbanConfig,
  kanbanInfo: kanbanInfo,
  kanbanInfoByGroup: kanbanInfoByGroup,
  sortByGroupOptions: [
    { key: 'none', value: '无', check: false },
    { key: 'users', value: '按人员', check: true },
    { key: 'category', value: '按类别', check: false },
    { key: 'priority', value: '按优先级', check: false },
  ],
  sortByRowAndStatusOptions: [
    { key: 'statue', value: '按状态', check: true },
    { key: 'name', value: '工作流名称', check: false },
  ],
  sortByView: [
    { key: 'default', value: '看板', isDefault: true, check: true },
    { key: '1', value: '团队看板', check: false },
    { key: '2', value: '日常跟进', check: false },
    { key: '3', value: '重点关注', check: false },
    { key: '4', value: '进度跟踪', check: false },
  ],
  guideVisible: false,
  saveAsViewModelInfo: {
    visible: false,
  },
  shareModelInfo: {
    visible: false,
  },
}

const slice = createSlice({
  name: 'kanBan',
  initialState,
  reducers: {
    onChangeGuideVisible(
      state,
      action: PayloadAction<SliceState['guideVisible']>,
    ) {
      state.guideVisible = action.payload
    },
    setShareModelInfo(
      state,
      action: PayloadAction<SliceState['shareModelInfo']>,
    ) {
      state.shareModelInfo = {
        ...state.shareModelInfo,
        ...action.payload,
      }
    },
    setSaveAsViewModelInfo(
      state,
      action: PayloadAction<SliceState['saveAsViewModelInfo']>,
    ) {
      state.saveAsViewModelInfo = {
        ...state.saveAsViewModelInfo,
        ...action.payload,
      }
    },
    onChangeSortByGroupOptions(
      state,
      action: PayloadAction<Model.KanBan.ViewItem['key']>,
    ) {
      const current = state.sortByGroupOptions?.find(
        item => item.key === action.payload,
      )
      if (!current) {
        return
      }
      state.sortByGroupOptions?.forEach(item => {
        item.check = false
        if (item.key === current?.key) {
          item.check = true
        }
      })
    },
    onChangeSortByRowAndStatusOptions(
      state,
      action: PayloadAction<Model.KanBan.ViewItem['key']>,
    ) {
      const current = state.sortByRowAndStatusOptions?.find(
        item => item.key === action.payload,
      )
      if (!current) {
        return
      }
      state.sortByRowAndStatusOptions?.forEach(item => {
        item.check = false
        if (item.key === current?.key) {
          item.check = true
        }
      })
    },
    onChangeSortByView(
      state,
      action: PayloadAction<Model.KanBan.ViewItem['key']>,
    ) {
      const current = state.sortByView?.find(
        item => item.key === action.payload,
      )
      if (!current) {
        return
      }
      state.sortByView?.forEach(item => {
        item.check = false
        if (item.key === current?.key) {
          item.check = true
        }
      })
    },
  },
})

const kanBan = slice.reducer

export const {
  onChangeSortByGroupOptions,
  onChangeSortByRowAndStatusOptions,
  onChangeSortByView,
  onChangeGuideVisible,
  setSaveAsViewModelInfo,
  setShareModelInfo,
} = slice.actions

export default kanBan
