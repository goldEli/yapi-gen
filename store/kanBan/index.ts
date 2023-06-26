import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  getKanbanByGroup,
  getKanbanConfig,
  getKanbanConfigList,
  getStoryViewList,
} from './kanBan.thunk'
import { Options } from '@/components/SelectOptionsNormal'
import i18next from 'i18next'

type SliceState = {
  // 全屏状态
  fullScreen: boolean
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
  userGroupingModelInfo: {
    visible: boolean
    userList: Model.User.User[]
    groupName: string
    id?: number
  }
  modifyStatusModalInfo: {
    visible: boolean
    storyId?: Model.KanBan.Story['id']
    info?: Model.Project.CheckStatusItem
  }
  kanbanInfo: Model.KanBan.Column[]
  kanbanInfoByGroup: Model.KanBan.Group[]
  kanbanConfig?: Model.KanbanConfig.Config
  kanbanConfigList: Model.KanbanConfig.Config[]
  movingStory: {
    columnId: Model.KanBan.Column['id']
    story: Model.KanBan.Story
    status?: Model.KanbanConfig.Status
    groupId: Model.KanBan.Group['id']
  } | null
}

const initialState: SliceState = {
  fullScreen: false,
  movingStory: null,
  kanbanConfigList: [],
  kanbanInfo: [],
  kanbanInfoByGroup: [],
  modifyStatusModalInfo: {
    visible: false,
  },
  userGroupingModelInfo: {
    visible: false,
    userList: [],
    groupName: '',
  },
  sortByGroupOptions: [
    { key: 'none', value: i18next.t('none'), check: false },
    { key: 'users', value: i18next.t('by_personnel'), check: false },
    { key: 'category', value: i18next.t('by_category'), check: false },
    { key: 'priority', value: i18next.t('by_priority'), check: true },
  ],
  sortByRowAndStatusOptions: [],
  sortByView: [],
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
    setFullScreen(state, action: PayloadAction<SliceState['fullScreen']>) {
      state.fullScreen = action.payload
    },
    setModifyStatusModalInfo(
      state,
      action: PayloadAction<SliceState['modifyStatusModalInfo']>,
    ) {
      state.modifyStatusModalInfo = action.payload
    },
    setKanbanInfoByGroup(
      state,
      action: PayloadAction<SliceState['kanbanInfoByGroup']>,
    ) {
      state.kanbanInfoByGroup = action.payload
    },
    // setViewItemConfig(
    //   state,
    //   action: PayloadAction<SliceState['viewItemConfig']>,
    // ) {
    //   state.viewItemConfig = {
    //     ...state.viewItemConfig,
    //     ...action.payload,
    //   }
    // },
    setMovingStory(state, action: PayloadAction<SliceState['movingStory']>) {
      state.movingStory = action.payload
    },
    setUserGroupingModelInfo(
      state,
      action: PayloadAction<SliceState['userGroupingModelInfo']>,
    ) {
      state.userGroupingModelInfo = action.payload
    },
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
      const { kanbanConfigList, sortByRowAndStatusOptions } = action.payload
      state.kanbanConfigList = kanbanConfigList
      state.sortByRowAndStatusOptions = sortByRowAndStatusOptions
    })
    builder.addCase(getStoryViewList.fulfilled, (state, action) => {
      state.sortByView = action.payload
      const checked = state.sortByView.find(item => item.check)
      state.viewItemConfig = checked?.config
    })
    builder.addCase(getKanbanByGroup.fulfilled, (state, action) => {
      state.kanbanInfoByGroup = action.payload
    })
    builder.addCase(getKanbanConfig.fulfilled, (state, action) => {
      state.kanbanConfig = action.payload
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
  setUserGroupingModelInfo,
  setMovingStory,
  setKanbanInfoByGroup,
  setModifyStatusModalInfo,
  setFullScreen,
} = slice.actions

export default kanBan
