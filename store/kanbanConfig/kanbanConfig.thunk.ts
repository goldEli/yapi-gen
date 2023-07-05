import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch, store } from '@store/index'
import {
  modifyColumn,
  setColumnListBackup,
  setEditColumnModelInfo,
  setSaveAsViewModelInfo,
  setViewList,
} from '.'
import { getMessage } from '@/components/Message'
import { getProjectIdByUrl } from '@/tools'
import { produce } from 'immer'
import { openConfirmModal } from '@/components/DeleteConfirmGlobal'
import i18next from 'i18next'

const name = 'KanbanConfig'

export const updateViewByViewId =
  (id: Model.KanbanConfig.ConfigListItem['id']) =>
  async (dispatch: AppDispatch) => {
    dispatch(setViewList(id))
    const checked = store
      .getState()
      .KanbanConfig.viewList?.find(item => item.id === id)
    checked && dispatch<any>(onFresh(checked))
  }

export const onChangeViewList =
  (id: Model.KanbanConfig.ConfigListItem['id']) =>
  async (dispatch: AppDispatch) => {
    //
    // 如果修改了 弹窗提醒
    const { columnList, columnListBackup } = store.getState().KanbanConfig
    if (JSON.stringify(columnList) !== JSON.stringify(columnListBackup)) {
      openConfirmModal({
        text: i18next.t('do_you_want_to_save_changes'),
        title: i18next.t('remind'),
        onConfirm: async () => {
          const res = await dispatch(saveKanbanConfig())
          dispatch(updateViewByViewId(id))
        },
        onCancel: () => {
          dispatch(updateViewByViewId(id))
        },
      })
      return
    }
    dispatch(updateViewByViewId(id))
  }

// 分类列表
export const getCategoryList = createAsyncThunk(
  `${name}/getCategoryList`,
  async (
    params: Pick<API.KanbanConfig.GetCategoryList.Params, 'project_id'>,
  ) => {
    const res = await services.kanbanConfig.getCategoryList({
      project_id: params.project_id,
      is_select: 2,
    })
    return res.data
  },
)

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
    getMessage({ msg: i18next.t('common.saveSuccess'), type: 'success' })
    dispatch(
      getKanbanConfigList({
        project_id: params.project_id,
      }),
    )
  }

// 更新备份数据
export const backUpKanbanConfig =
  (params: Pick<API.KanbanConfig.UpdateKanbanConfig.Params, 'columns'>) =>
  async (dispatch: AppDispatch) => {
    if (params.columns) {
      dispatch(setColumnListBackup(params.columns))
    }
  }

// 修改看板配置(包含列)
export const saveKanbanConfig = () => async (dispatch: AppDispatch) => {
  const { viewList, columnList } = store.getState().KanbanConfig
  const checked = viewList?.find(item => item.check)
  if (!checked) {
    throw Error('params error')
  }
  const params: API.KanbanConfig.UpdateKanbanConfig.Params = {
    ...checked,
    columns: columnList,
  }
  const res = await services.kanbanConfig.updateKanbanConfig(params)
  dispatch(backUpKanbanConfig(params))
  getMessage({ msg: i18next.t('common.saveSuccess'), type: 'success' })
}

// 删除看板配置
export const deleteKanbanConfig =
  (params: API.KanbanConfig.DeleteKanbanConfig.Params) =>
  async (dispatch: AppDispatch) => {
    const res = await services.kanbanConfig.deleteKanbanConfig(params)
    getMessage({ type: 'success', msg: i18next.t('common.deleteSuccess') })
    dispatch(
      getKanbanConfigList({
        project_id: params.project_id,
      }),
    )
  }

// 看板配置列表
export const getKanbanConfigList = createAsyncThunk(
  `${name}/getKanbanConfigList`,
  async (param: API.KanbanConfig.GetKanbanConfigList.Params, { dispatch }) => {
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
    // 从缓存中取出

    // 更新相关数据
    const checkedViewListItem = ret.find(item => item.check)
    if (checkedViewListItem) {
      dispatch<any>(onFresh(checkedViewListItem))
    }
    return ret
  },
)

export const onFresh =
  (currentViewListItem: Model.KanbanConfig.ConfigListItem) =>
  async (dispatch: AppDispatch) => {
    if (!currentViewListItem) {
      return
    }
    const params = {
      project_id: currentViewListItem.project_id,
      id: currentViewListItem.id,
    }
    // debugger  设为默认的时候 不走获取看板配置接口
    dispatch(getKanbanConfigRemainingStatus(params))
    if (!store.getState().KanbanConfig.isSettingDefault) {
      dispatch(getKanbanConfig(params))
    }
    dispatch(getCategoryList({ project_id: params.project_id }))
  }

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
    if (!data.name) {
      return
    }
    const { columnList } = store.getState().KanbanConfig
    let createId = 0
    if (!data.id) {
      const res = await services.kanbanConfig.createKanbanConfig({
        name: data.name,
        project_id: data.project_id,
      })
      createId = res.data.id
    }
    if (!!data.id) {
      const res = await services.kanbanConfig.updateKanbanConfig({
        name: data.name,
        project_id: data.project_id,
        columns: columnList,
        id: data.id,
      })
      createId = res.data.id
    }
    dispatch(backUpKanbanConfig({ columns: columnList }))
    getMessage({ msg: i18next.t('common.saveSuccess'), type: 'success' })
    dispatch(closeSaveAsViewModel())
    await dispatch(
      getKanbanConfigList({
        project_id: data.project_id,
      }),
    )
    dispatch(onChangeViewList(createId))
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
    if (store.getState().KanbanConfig.isSettingDefault) {
      getMessage({ msg: '设置默认成功', type: 'success' })
    } else {
      getMessage({ msg: i18next.t('common.saveSuccess'), type: 'success' })
    }
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
