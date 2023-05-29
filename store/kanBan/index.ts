import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { kanbanInfo, kanbanInfoByGroup, kanbanConfig } from './data'
import {
  getKanbanByGroup,
  getKanbanConfigList,
  getStoryViewList,
} from './kanBan.thunk'
import { Options } from '@/components/SelectOptionsNormal'

type SliceState = {
  guideVisible: Model.KanBan.guideVisible
  sortByGroupOptions?: Model.KanBan.GroupInfoItem[]
  sortByRowAndStatusOptions?: Options[]
  sortByView?: Model.KanBan.ViewItem[]
  viewItemConfig?: Model.KanBan.ViewItem['config']
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
  kanbanConfigList: Model.KanbanConfig.Config[]
}

const initialState: SliceState = {
  kanbanConfigList: [],
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
    // { key: 'statue', value: '按状态', check: true },
    // { key: 'name', value: '工作流名称', check: false },
  ],
  sortByView: [
    // { key: 'default', value: '看板', isDefault: true, check: true },
    // { key: '1', value: '团队看板', check: false },
    // { key: '2', value: '日常跟进', check: false },
    // { key: '3', value: '重点关注', check: false },
    // { key: '4', value: '进度跟踪', check: false },
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
    // setViewItemConfig(
    //   state,
    //   action: PayloadAction<SliceState['viewItemConfig']>,
    // ) {
    //   state.viewItemConfig = {
    //     ...state.viewItemConfig,
    //     ...action.payload,
    //   }
    // },
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
    setSortByGroupOptions(state, action: PayloadAction<Options['key']>) {
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
    setSortByRowAndStatusOptions(state, action: PayloadAction<Options['key']>) {
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
    setSortByView(state, action: PayloadAction<Model.KanBan.ViewItem['id']>) {
      // onTapSearchChoose
      const current = state.sortByView?.find(item => item.id === action.payload)
      if (!current) {
        return
      }
      state.sortByView?.forEach(item => {
        item.check = false
        if (item.id === current?.id) {
          item.check = true
        }
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(getKanbanConfigList.fulfilled, (state, action) => {
      state.kanbanConfigList = action.payload
      const res = action.payload.map(item => {
        return {
          check: false,
          value: item.name,
          key: item.id + '',
        }
      })
      if (res.length) {
        res[0].check = true
      }
      state.sortByRowAndStatusOptions = res
    })
    builder.addCase(getStoryViewList.fulfilled, (state, action) => {
      state.sortByView = action.payload

      const checked = state.sortByView.find(item => item.check)
      state.viewItemConfig = checked?.config
    })
    builder.addCase(getKanbanByGroup.fulfilled, (state, action) => {
      state.kanbanInfoByGroup = action.payload
    })
  },
})

const kanBan = slice.reducer

export const {
  setSortByGroupOptions,
  setSortByRowAndStatusOptions,
  setSortByView,
  onChangeGuideVisible,
  setSaveAsViewModelInfo,
  setShareModelInfo,
  // setViewItemConfig,
} = slice.actions

export default kanBan
