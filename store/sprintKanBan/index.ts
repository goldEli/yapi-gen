import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SliceState = {
  sortByGroupOptions?: Model.SprintKanBan.ViewItem[]
  sortByRowAndStatusOptions?: Model.SprintKanBan.ViewItem[]
  sortByView?: Model.SprintKanBan.ViewItem[]
  saveAsViewModelInfo: {
    visible: boolean
    viewItem?: Model.SprintKanBan.ViewItem
  }
  shareModelInfo: {
    visible: boolean
  }
}

const initialState: SliceState = {
  sortByGroupOptions: [
    { key: 'none', value: '无', check: true },
    { key: 'person', value: '按人员', check: false },
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
  saveAsViewModelInfo: {
    visible: false,
  },
  shareModelInfo: {
    visible: false,
  },
}

const slice = createSlice({
  name: 'sprintKanBan',
  initialState,
  reducers: {
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
      action: PayloadAction<Model.SprintKanBan.ViewItem['key']>,
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
      action: PayloadAction<Model.SprintKanBan.ViewItem['key']>,
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
      action: PayloadAction<Model.SprintKanBan.ViewItem['key']>,
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

const sprintKanBan = slice.reducer

export const {
  onChangeSortByGroupOptions,
  onChangeSortByRowAndStatusOptions,
  onChangeSortByView,
  setSaveAsViewModelInfo,
  setShareModelInfo,
} = slice.actions

export default sprintKanBan
