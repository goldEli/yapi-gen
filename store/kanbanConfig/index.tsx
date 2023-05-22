import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { columnList, unassignStatusList } from './mockData'
import { UNASSIGNED_STATUS } from '@/views/ProjectSetting/components/KanBanSetting/constant'
import { getId } from '@/views/ProjectSetting/components/KanBanSetting/utils'

type SliceState = {
  viewList?: Model.KanbanConfig.ConfigListItem[]
  saveAsViewModelInfo: {
    visible: boolean
    viewItem?: Model.KanbanConfig.ConfigListItem
  }
  unassignStatusList: Model.KanbanConfig.Status[]
  columnList: Model.KanbanConfig.Column[]
}

const initialState: SliceState = {
  viewList: [
    { id: 1, project_id: 11, name: '看板', is_default: 1, check: true },
    { id: 2, project_id: 11, name: '团队啥的话那就阿萨德看板', check: false },
    { id: 3, project_id: 11, name: '日常跟进', check: false },
    { id: 4, project_id: 11, name: '重点关注', check: false },
    { id: 5, project_id: 11, name: '进度跟踪', check: false },
  ],
  columnList: columnList,

  saveAsViewModelInfo: {
    visible: false,
  },
  unassignStatusList: unassignStatusList,
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

export const {
  onChangeViewList,
  setSaveAsViewModelInfo,
  modifyAssignedStatus,
  modifyUnassignedStatus,
  assignStatus,
  unassignStatus,
} = slice.actions

export default KanbanConfig
