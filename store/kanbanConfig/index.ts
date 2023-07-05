import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getId } from '@/views/ProjectSetting/components/KanBanSetting/utils'
import { getNumberId } from './utils'
import {
  getCategoryList,
  getKanbanConfig,
  getKanbanConfigList,
  getKanbanConfigRemainingStatus,
} from './kanbanConfig.thunk'
import { store } from '..'

type SliceState = {
  projectId?: Model.KanbanConfig.Config['project_id']
  viewList?: Model.KanbanConfig.Config[]
  categoryList?: Model.KanbanConfig.Category[]
  saveAsViewModelInfo: {
    visible: boolean
    title?: string
    viewItem?: Model.KanbanConfig.Config
  }
  editColumnModelInfo: {
    visible: boolean
    columnInfo?: Model.KanbanConfig.Column
  }
  unassignStatusList: Model.KanbanConfig.Status[]
  columnList: Model.KanbanConfig.Column[]
  // 备份用于检测是否修改，提醒用户保存
  columnListBackup: Model.KanbanConfig.Column[]
  /**
   * 分类收起菜单控制
   */
  categoryVisibleInfo: {
    categoryId: Model.KanbanConfig.Category['id']
    close: boolean
  }[]
  // 正在拖动的状态
  movingStatus: Model.KanbanConfig.Status | null
  // 是否设为默认
  isSettingDefault?: boolean
}

const initialState: SliceState = {
  categoryList: [],
  movingStatus: null,
  editColumnModelInfo: {
    visible: false,
  },
  categoryVisibleInfo: [],
  viewList: [],
  columnList: [],
  columnListBackup: [],
  saveAsViewModelInfo: {
    visible: false,
  },
  unassignStatusList: [],
  isSettingDefault: false,
}
interface DragResult {
  source: {
    droppableId: string
    index: number
  }
  destination: {
    droppableId: string
    index: number
  }
}
const slice = createSlice({
  name: 'kanbanConfig',
  initialState,
  reducers: {
    setColumnListBackup(
      state,
      action: PayloadAction<SliceState['columnListBackup']>,
    ) {
      state.columnListBackup = action.payload
    },
    setMovingStatus(
      state,
      action: PayloadAction<{
        id: Model.KanbanConfig.Status['flow_status_id']
        // 从未分配列表拖过来
        fromUnassignedPlane: boolean
      }>,
    ) {
      if (action.payload.fromUnassignedPlane) {
        state.unassignStatusList.forEach(item => {
          if (item.flow_status_id === action.payload.id) {
            state.movingStatus = item
          }
        })
        return
      }
      state.columnList.forEach(item => {
        item.categories.forEach(cate => {
          cate?.status?.forEach(status => {
            if (status.flow_status_id === action.payload.id) {
              state.movingStatus = status
            }
          })
        })
      })
    },
    clearMovingStatus(state) {
      state.movingStatus = null
    },
    setEditColumnModelInfo(
      state,
      action: PayloadAction<SliceState['editColumnModelInfo']>,
    ) {
      state.editColumnModelInfo = action.payload
    },
    modifyColumn(state, action: PayloadAction<Model.KanbanConfig.Column>) {
      state.columnList = state.columnList.map(item => {
        if (item.id === action.payload.id) {
          return action.payload
        }
        return item
      })
    },
    deleteColumn(
      state,
      action: PayloadAction<Model.KanbanConfig.Column['id']>,
    ) {
      const index = state.columnList.findIndex(
        item => item.id === action.payload,
      )
      if (index >= 0) {
        state.columnList.splice(index, 1)
      }
    },
    createColumn(
      state,
      action: PayloadAction<Model.KanbanConfig.Column['name']>,
    ) {
      const kanban_config_id = state.viewList?.find(item => item.check)?.id
      const categories = state.columnList.length
        ? state.columnList[0].categories.map(item => {
            return {
              ...item,
              status: [],
            }
          })
        : state.categoryList?.map(item => {
            return {
              ...item,
              status: [],
            }
          }) ?? []
      const list = {
        id: getNumberId(state.columnList?.map(item => item.id)),
        kanban_config_id: kanban_config_id ?? 0,
        name: action.payload,
        max_num: 1,
        categories,
      }
      state.columnList.push(list)
    },
    setCategoryVisibleInfo(
      state,
      action: PayloadAction<Model.KanbanConfig.Category['id']>,
    ) {
      const current = state.categoryVisibleInfo.find(
        item => item.categoryId === action.payload,
      )
      if (current) {
        current.close = !current.close
        return
      }
      state.categoryVisibleInfo.push({
        categoryId: action.payload,
        close: true,
      })
    },
    sortColumn(state, action: PayloadAction<DragResult>) {
      const { source, destination } = action.payload
      // 源移除的卡片数据
      const [removed] = state.columnList?.splice(source.index, 1) ?? []
      // 移除的卡片数据插入目标中
      if (removed) {
        state.columnList?.splice(destination.index, 0, removed)
      }
    },
    assignStatus(state, action: PayloadAction<DragResult>) {
      const { source, destination } = action.payload
      // 源移除的卡片数据
      const [removed] = state.unassignStatusList?.splice(source.index, 1) ?? []
      // 移除的卡片数据插入目标中
      if (removed) {
        // 获取目标数据
        const destinationData = state.columnList
          .find(item => item.id === getId(destination.droppableId).groupId)
          ?.categories.find(
            item => item.id === getId(destination.droppableId).id,
          )
        destinationData?.status?.splice(destination.index, 0, removed)
      }
    },
    unassignStatus(state, action: PayloadAction<DragResult>) {
      const { source, destination } = action.payload
      // 获取拖动源数据
      const sourceData = state.columnList
        .find(item => item.id === getId(source.droppableId).groupId)
        ?.categories.find(item => item.id === getId(source.droppableId).id)
      // 获取目标数据
      const destinationData = state.unassignStatusList
      // 源移除的卡片数据
      const [removed] = sourceData?.status?.splice(source.index, 1) ?? []
      // 移除的卡片数据插入目标中
      if (removed) {
        removed.attachment_path = sourceData?.attachment_path
        destinationData?.splice(destination.index, 0, removed)
      }
    },
    modifyUnassignedStatus(state, action: PayloadAction<DragResult>) {
      const { source, destination } = action.payload
      if (source.droppableId !== destination.droppableId) {
        return
      }
      // 同容器拖动
      // 获取拖动源数据
      // const sourceData = state.unassignStatusList.find(
      //   item => item.flow_status_id + '' === draggableId,
      // )
      // 源移除的卡片数据
      const [removed] = state.unassignStatusList?.splice(source.index, 1) ?? []
      // 移除的卡片数据插入目标中
      if (removed) {
        state.unassignStatusList?.splice(destination.index, 0, removed)
      }
    },
    modifyAssignedStatus(state, action: PayloadAction<DragResult>) {
      const { source, destination } = action.payload
      // 跨容器拖动
      if (source.droppableId !== destination.droppableId) {
        // 获取拖动源数据
        const sourceData = state.columnList
          .find(item => item.id === getId(source.droppableId).groupId)
          ?.categories.find(item => item.id === getId(source.droppableId).id)
        // 获取目标数据
        const destinationData = state.columnList
          .find(item => item.id === getId(destination.droppableId).groupId)
          ?.categories.find(
            item => item.id === getId(destination.droppableId).id,
          )
        // 源移除的卡片数据
        const [removed] = sourceData?.status?.splice(source.index, 1) ?? []
        // 移除的卡片数据插入目标中
        if (removed) {
          destinationData?.status?.splice(destination.index, 0, removed)
        }
        return
      }
      // 同容器拖动
      // 获取拖动源数据
      const sourceData = state.columnList
        .find(item => item.id === getId(source.droppableId).groupId)
        ?.categories.find(item => item.id === getId(source.droppableId).id)
      // 源移除的卡片数据
      const [removed] = sourceData?.status?.splice(source.index, 1) ?? []
      // 移除的卡片数据插入目标中
      if (removed) {
        sourceData?.status?.splice(destination.index, 0, removed)
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
    setViewList(
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
    setIsSettingDefault(state, action: PayloadAction<boolean>) {
      state.isSettingDefault = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getKanbanConfigList.fulfilled, (state, action) => {
      state.viewList = action.payload
    })
    builder.addCase(
      getKanbanConfigRemainingStatus.fulfilled,
      (state, action) => {
        state.unassignStatusList = action.payload
      },
    )
    builder.addCase(getKanbanConfig.fulfilled, (state, action) => {
      console.log('columnList--', action.payload)
      state.columnList = action.payload ?? []
      state.columnListBackup = action.payload ?? []
    })
    builder.addCase(getCategoryList.fulfilled, (state, action) => {
      state.categoryList = action.payload
    })
  },
})

const KanbanConfig = slice.reducer

export const {
  setViewList,
  setSaveAsViewModelInfo,
  modifyAssignedStatus,
  modifyUnassignedStatus,
  assignStatus,
  unassignStatus,
  sortColumn,
  setCategoryVisibleInfo,
  createColumn,
  setEditColumnModelInfo,
  deleteColumn,
  modifyColumn,
  setMovingStatus,
  clearMovingStatus,
  setColumnListBackup,
  setIsSettingDefault,
} = slice.actions

export default KanbanConfig
