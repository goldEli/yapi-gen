import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SliceState = {
  viewList?: Model.KanbanConfig.ConfigListItem[]
}

const initialState: SliceState = {
  viewList: [
    { id: 1, project_id: 11, name: '看板', is_default: 1, check: true },
    { id: 2, project_id: 11, name: '团队啥的话那就阿萨德看板', check: false },
    { id: 3, project_id: 11, name: '日常跟进', check: false },
    { id: 4, project_id: 11, name: '重点关注', check: false },
    { id: 5, project_id: 11, name: '进度跟踪', check: false },
  ],
}

const slice = createSlice({
  name: 'kanbanConfig',
  initialState,
  reducers: {
    onChangeViewList(
      state,
      action: PayloadAction<Model.KanbanConfig.ConfigListItem['id']>,
    ) {
      const current = state.viewList?.find(item => item.id === action.payload)
      if (!current) {
        return
      }
      state.viewList?.forEach(item => {
        item.check = false
        if (item.id === current?.id) {
          item.check = true
        }
      })
    },
  },
})

const KanbanConfig = slice.reducer

export const { onChangeViewList } = slice.actions

export default KanbanConfig
