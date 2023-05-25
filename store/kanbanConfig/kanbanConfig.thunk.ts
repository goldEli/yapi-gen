import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch, store } from '@store/index'
import { modifyColumn, setEditColumnModelInfo, setSaveAsViewModelInfo } from '.'
import { getMessage } from '@/components/Message'
import { getParamsValueByKey } from '@/tools'
import { produce } from 'immer'

const name = 'KanbanConfig'

// 删除
export const deleteKanbanConfig =
  (params: API.KanbanConfig.DeleteKanbanConfig.Params) =>
  async (dispatch: AppDispatch) => {
    const res = await services.kanbanConfig.deleteKanbanConfig(params)
    getMessage({ type: 'success', msg: '删除成功！' })
    dispatch(
      getKanbanConfigList({
        project_id: params.project_id,
      }),
    )
  }

// 看板配置列表
export const getKanbanConfigList = createAsyncThunk(
  `${name}/getKanbanConfigList`,
  async (param: API.KanbanConfig.GetKanbanConfigList.Params) => {
    const res = await services.kanbanConfig.getKanbanConfigList(param)
    const { viewList } = store.getState().KanbanConfig
    const currentCheck = viewList?.find(item => item.check)
    if (currentCheck) {
      return res.data.map(item => {
        if (currentCheck.id === item.id) {
          return {
            ...item,
            check: true,
          }
        }
        return {
          ...item,
          check: false,
        }
      })
    }
    return res.data.map((item, idx) => {
      if (idx === 0) {
        return {
          ...item,
          check: true,
        }
      }
      return {
        ...item,
        check: false,
      }
    })
  },
)

// 属性看板
export const onRefreshKanBan = () => async (dispatch: AppDispatch) => {}

export const openSaveAsViewModel =
  (options?: {
    id?: Model.KanbanConfig.ConfigListItem['id']
    title?: string
  }) =>
  async (dispatch: AppDispatch) => {
    const { viewList } = store.getState()?.KanbanConfig
    const viewItem = viewList?.find(item => item.id === options?.id)
    dispatch(
      setSaveAsViewModelInfo({
        visible: true,
        viewItem,
        title: options?.title,
      }),
    )
  }

export const closeSaveAsViewModel = () => async (dispatch: AppDispatch) => {
  dispatch(setSaveAsViewModelInfo({ visible: false }))
}

// 保存视图
export const onSaveAsViewModel =
  (
    data: Partial<Model.SprintKanBan.ViewItem> & {
      projectId: number
    },
  ) =>
  async (dispatch: AppDispatch) => {
    // TODO
    if (!data.value) {
      return
    }
    const res = await services.kanbanConfig.createKanbanConfig({
      name: data.value,
      project_id: data.projectId,
    })
    getMessage({ msg: '保存成功!', type: 'success' })
    dispatch(closeSaveAsViewModel())
    dispatch(
      getKanbanConfigList({
        project_id: data.projectId,
      }),
    )
  }

export const openEditColumnModel =
  (data: Model.KanbanConfig.Column) => async (dispatch: AppDispatch) => {
    dispatch(
      setEditColumnModelInfo({
        visible: true,
        columnInfo: data,
      }),
    )
  }

export const closeEditColumnModel = () => async (dispatch: AppDispatch) => {
  dispatch(
    setEditColumnModelInfo({
      visible: false,
    }),
  )
}

export const onOkEditColumnModel =
  (data: Model.KanbanConfig.Column) => async (dispatch: AppDispatch) => {
    dispatch(modifyColumn(data))
    dispatch(
      setEditColumnModelInfo({
        visible: false,
      }),
    )
  }
