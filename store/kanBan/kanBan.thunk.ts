import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch, store } from '@store/index'
import {
  // onChangeSortByView,
  setSortByView,
  setSaveAsViewModelInfo,
  setShareModelInfo,
  // setViewItemConfig,
} from '.'
import { getMessage } from '@/components/Message'
import { getParamsValueByKey } from '@/tools'
import i18n from 'i18next'
import { onTapSearchChoose, saveValue, setView } from '@store/view'
import { generatorFilterParams } from './utils'

const name = 'kanBan'

export const onChangeSortByView =
  (id: Model.KanBan.ViewItem['id']) => async (dispatch: AppDispatch) => {
    await dispatch(setSortByView(id))
    const current = store
      .getState()
      .kanBan.sortByView?.find(item => item.id === id)
    if (!current) {
      return
    }
    dispatch(saveValue(current.config?.search ?? {}))
    const params = generatorFilterParams(current.config)
    dispatch(onTapSearchChoose(params))
  }
export const delView =
  (params: API.Kanban.DelView.Params) => async (dispatch: AppDispatch) => {
    await services.kanban.delView(params)
    getMessage({
      msg: i18n.t('common.deleteSuccess') as string,
      type: 'success',
    })
    dispatch(getStoryViewList())
  }

// 创建视图
export const createView =
  (params: Omit<API.Kanban.CreateView.Params, 'use_type'>) =>
  async (dispatch: AppDispatch) => {
    const project_id = getParamsValueByKey('id')
    const res = await services.kanban.createView({
      ...params,
      config: store.getState().view,
      project_id,
      use_type: 2,
    })
    getMessage({ msg: i18n.t('common.saveSuccess') as string, type: 'success' })
    await dispatch(getStoryViewList())
    dispatch(onChangeSortByView(res.data.id))
  }

export const updateView =
  (params: API.Kanban.UpdateView.Params) => async (dispatch: AppDispatch) => {
    await services.kanban.updateView(params)
    getMessage({ msg: i18n.t('common.editSuccess') as string, type: 'success' })
    dispatch(getStoryViewList())
  }

export const onFilter =
  (data: Model.KanBan.ViewItemConfig) => async (dispatch: AppDispatch) => {
    const { valueKey } = store.getState().view
    console.log({ valueKey })

    // dispatch(getStoryViewList())
  }

// 看板配置列表
export const getKanbanConfigList = createAsyncThunk(
  `${name}/getKanbanConfigList`,
  async (param: API.KanbanConfig.GetKanbanConfigList.Params) => {
    const res = await services.kanbanConfig.getKanbanConfigList(param)
    return res.data
  },
)

// 属性看板
export const onRefreshKanBan = () => async (dispatch: AppDispatch) => {}

export const openSaveAsViewModel =
  (id?: Model.KanBan.ViewItem['id']) => async (dispatch: AppDispatch) => {
    const { sortByView } = store.getState()?.kanBan
    const viewItem = sortByView?.find(item => item?.id === id)
    dispatch(setSaveAsViewModelInfo({ visible: true, viewItem }))
  }

export const closeSaveAsViewModel = () => async (dispatch: AppDispatch) => {
  dispatch(setSaveAsViewModelInfo({ visible: false }))
}

// 视图列表
export const getStoryViewList = createAsyncThunk(
  `${name}/getStoryViewList`,
  async (_, { dispatch }) => {
    const project_id = getParamsValueByKey('id')
    const res = await services.kanban.getStoryViewList({ project_id })
    const { data } = res

    const { sortByView } = store.getState().kanBan

    const ret = data.map(item => {
      return {
        ...item,
        check: false,
        isDefault: item.type === 2,
      }
    })
    if (!sortByView?.length) {
      ret[0].check = true
      const config = ret[0]?.config ?? {}
      const params = generatorFilterParams(config)
      dispatch(onTapSearchChoose(params))
      return ret
    }
    const checked = sortByView.find(item => item.check)
    const params = generatorFilterParams(checked?.config)
    dispatch(onTapSearchChoose(params))
    return ret.map(item => {
      if (item.id === checked?.id) {
        return {
          ...item,
          check: true,
        }
      }
      return item
    })
  },
)

// 保存视图
export const onSaveAsViewModel =
  (data: Partial<Model.SprintKanBan.ViewItem>) =>
  async (dispatch: AppDispatch) => {
    dispatch(
      createView({
        name: data.value ?? '',
        project_id: getParamsValueByKey('id'),
      }),
    )
    console.log('onSaveAsViewModel', data)
    getMessage({ msg: '保存成功!', type: 'success' })
    dispatch(closeSaveAsViewModel())
  }

// 打开分享弹窗
export const openShareModel = () => async (dispatch: AppDispatch) => {
  dispatch(setShareModelInfo({ visible: true }))
}

// 关闭分享弹窗
export const closeShareModel = () => async (dispatch: AppDispatch) => {
  dispatch(setShareModelInfo({ visible: false }))
}

// 分享
export const onShareModel = () => async (dispatch: AppDispatch) => {
  // TODO

  getMessage({ msg: '保存成功!', type: 'success' })
  dispatch(closeSaveAsViewModel())
}
