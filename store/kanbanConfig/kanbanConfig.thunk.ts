import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch, store } from '@store/index'
import { modifyColumn, setEditColumnModelInfo, setSaveAsViewModelInfo } from '.'
import { getMessage } from '@/components/Message'
import { getParamsValueByKey } from '@/tools'
import { produce } from 'immer'

const name = 'KanbanConfig'
// 获取未分配状态列表
export const getKanbanConfigRemainingStatus = createAsyncThunk(
  `${name}/getKanbanConfigRemainingStatus`,
  async (params: API.KanbanConfig.GetKanbanConfigRemainingStatus.Params) => {
    const res = await services.kanbanConfig.getKanbanConfigRemainingStatus(
      params,
    )
    return res.data
  },
)

export const getKanbanConfig = createAsyncThunk(
  `${name}/getKanbanConfig`,
  async (params: API.KanbanConfig.GetKanbanConfig.Params) => {
    const res = await services.kanbanConfig.getKanbanConfig(params)
    return res.data.columns
  },
)

// 修改看板配置
export const updateKanbanConfig =
  (params: API.KanbanConfig.UpdateKanbanConfig.Params) =>
  async (dispatch: AppDispatch) => {
    const res = await services.kanbanConfig.updateKanbanConfig(params)
    getMessage({ type: 'success', msg: '保存成功！' })
    dispatch(
      getKanbanConfigList({
        project_id: params.project_id,
      }),
    )
  }

// 删除看板配置
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
    const currentCheck = viewList?.find(
      item => res.data.some(i => i.id === item.id) && item.check,
    )
    const ret = produce(res.data, draft => {
      // 如果当前没有选中的，默认第一个选中
      if (!currentCheck && draft.length) {
        draft[0].check = true
        return
      }
      // 新列表恢复选中状态
      for (const item of draft) {
        if (currentCheck && currentCheck.id === item.id) {
          item.check = true
          break
        }
      }
    })

    return ret
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
  (data: API.KanbanConfig.UpdateKanbanConfig.Params) =>
  async (dispatch: AppDispatch) => {
    // TODO
    if (!data.name) {
      return
    }
    if (!data.id) {
      const res = await services.kanbanConfig.createKanbanConfig({
        name: data.name,
        project_id: data.project_id,
      })
    }
    if (!!data.id) {
      const res = await services.kanbanConfig.updateKanbanConfig({
        id: data.id,
        name: data.name,
        project_id: data.project_id,
      })
    }
    getMessage({ msg: '保存成功!', type: 'success' })
    dispatch(closeSaveAsViewModel())
    dispatch(
      getKanbanConfigList({
        project_id: data.project_id,
      }),
    )
  }

export const setDefaultKanbanConfig =
  (data: Pick<API.KanbanConfig.UpdateKanbanConfig.Params, 'id'>) =>
  async (dispatch: AppDispatch) => {
    const { name, project_id } =
      store
        .getState()
        .KanbanConfig.viewList?.find(item => item.id === data.id) ?? {}
    if (!name || !project_id) {
      throw Error('params error')
    }
    const res = await services.kanbanConfig.updateKanbanConfig({
      id: data.id,
      name: name,
      project_id: project_id,
      is_default: 1,
    })
    getMessage({ msg: '保存成功!', type: 'success' })
    dispatch(
      getKanbanConfigList({
        project_id: project_id,
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
