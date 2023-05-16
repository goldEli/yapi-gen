import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SliceState = {
  sortByGroupOptions?: Model.SprintKanBan.Option[]
  sortByRowAndStatusOptions?: Model.SprintKanBan.Option[]
  sortByView?: Model.SprintKanBan.Option[]
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
}

const slice = createSlice({
  name: 'sprintKanBan',
  initialState,
  reducers: {
    onChangeSortByGroupOptions(
      state,
      action: PayloadAction<Model.SprintKanBan.Option['key']>,
    ) {
      const current = state.sortByGroupOptions?.find(
        item => item.key === action.payload,
      )
      state.sortByGroupOptions?.forEach(item => {
        if (!current) {
          return
        }
        item.check = false
        if (item.key === current?.key) {
          item.check = true
        }
      })
    },
    onChangeSortByRowAndStatusOptions(
      state,
      action: PayloadAction<Model.SprintKanBan.Option['key']>,
    ) {
      const current = state.sortByRowAndStatusOptions?.find(
        item => item.key === action.payload,
      )
      state.sortByRowAndStatusOptions?.forEach(item => {
        if (!current) {
          return
        }
        item.check = false
        if (item.key === current?.key) {
          item.check = true
        }
      })
    },
    onChangeSortByView(
      state,
      action: PayloadAction<Model.SprintKanBan.Option['key']>,
    ) {
      const current = state.sortByView?.find(
        item => item.key === action.payload,
      )
      state.sortByView?.forEach(item => {
        if (!current) {
          return
        }
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
} = slice.actions

export default sprintKanBan
