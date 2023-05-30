import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch, store } from '@store/index'
import {
  // onChangeSortByView,
  setSortByView,
  setSaveAsViewModelInfo,
  setShareModelInfo,
  setSortByGroupOptions,
  setSortByRowAndStatusOptions,
  setUserGroupingModelInfo,
  // setViewItemConfig,
} from '.'
import { getMessage } from '@/components/Message'
import { getParamsValueByKey } from '@/tools'
import i18n from 'i18next'
import { onTapSearchChoose, saveValue } from '@store/view'
import { generatorFilterParams } from './utils'
import _ from 'lodash'
import { Options } from '@/components/SelectOptionsNormal'

const name = 'kanBan'

// 打开分组弹窗
export const openUserGroupingModel =
  (
    params: Partial<
      Omit<Parameters<typeof setUserGroupingModelInfo>[0], 'visible'>
    >,
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(
      setUserGroupingModelInfo({
        groupName: params?.groupName ?? '',
        visible: true,
        userList: params?.userList ?? [],
        id: params.id,
      }),
    )
  }
// 关闭分组弹窗
export const closeUserGroupingModel = () => async (dispatch: AppDispatch) => {
  dispatch(
    setUserGroupingModelInfo({
      groupName: '',
      visible: false,
      userList: [],
    }),
  )
}
// 保存分组弹窗
export const saveUserGroupingModel =
  (params: Omit<API.Kanban.CreateKanbanPeopleGrouping.Params, 'project_id'>) =>
  async (dispatch: AppDispatch) => {
    const projectId = getParamsValueByKey('id')
    const { userGroupingModelInfo } = store.getState().kanBan
    const p = {
      project_id: projectId,
      name: params.name,
      user_ids: params.user_ids,
    }
    if (userGroupingModelInfo.id) {
      const res = await services.kanban.modifyKanbanPeopleGrouping({
        ...p,
        id: userGroupingModelInfo.id,
      })
    } else {
      const res = await services.kanban.createKanbanPeopleGrouping(p)
    }
    getMessage({ msg: i18n.t('common.saveSuccess'), type: 'success' })
    dispatch(closeUserGroupingModel())
    dispatch(getKanbanByGroup())
  }

// 修改分组弹窗
export const modifyKanbanPeopleGrouping =
  (
    params: Pick<
      API.Kanban.ModifyKanbanPeopleGrouping.Params,
      'name' | 'user_ids' | 'id'
    >,
  ) =>
  async (dispatch: AppDispatch) => {
    const projectId = getParamsValueByKey('id')
    const res = await services.kanban.modifyKanbanPeopleGrouping({
      project_id: projectId,
      name: params.name,
      user_ids: params.user_ids,
      id: params.id,
    })
    getMessage({ msg: i18n.t('common.saveSuccess'), type: 'success' })
    dispatch(closeUserGroupingModel())
    dispatch(getKanbanByGroup())
  }

// 获取看板配置
export const getKanbanConfig = createAsyncThunk(
  `${name}/getKanbanConfig`,
  async (params: API.KanbanConfig.GetKanbanConfig.Params) => {
    const res = await services.kanbanConfig.getKanbanConfig(params)
    return res.data
  },
)

const isEmpty = (data: any) => {
  if (_.isEmpty(data)) {
    return true
  }
  return Object.entries(data).every(([key, value]) => {
    return _.isEmpty(value)
  })
}

// 获取故事列表（分组）
export const getKanbanByGroup = createAsyncThunk(
  `${name}/getKanbanByGroup`,
  async () => {
    const { valueKey, inputKey } = store.getState().view
    const { sortByGroupOptions, sortByRowAndStatusOptions } =
      store.getState().kanBan
    const type = sortByGroupOptions?.find(item => item.check)?.key
    const columnId = sortByRowAndStatusOptions?.find(item => item.check)?.key
    if (!columnId) {
      return []
    }
    if (!type) {
      return []
    }
    const params = {
      search: isEmpty(valueKey)
        ? {
            all: 1,
            keyword: inputKey,
          }
        : { ...valueKey, keyword: inputKey },
      project_id: getParamsValueByKey('id'),
      kanban_config_id: parseInt(columnId, 10),
    }
    if (type === 'none') {
      const res = await services.kanban.getKanban(params)
      return [
        {
          // 无分组id
          id: 0,
          name: '',
          content_txt: '',
          columns: res.data,
        },
      ]
    }

    const res = await services.kanban.getKanbanByGroup({
      ...params,
      group_by: type,
    })
    return res.data
  },
)

// 更换视图
export const onChangeSortByView =
  (id: Model.KanBan.ViewItem['id']) => async (dispatch: AppDispatch) => {
    await dispatch(setSortByView(id))
    const current = store
      .getState()
      .kanBan.sortByView?.find(item => item.id === id)
    if (!current) {
      return
    }
    await dispatch(saveValue(current.config?.search ?? {}))
    const params = generatorFilterParams(current.config)
    await dispatch(onTapSearchChoose(params))
    dispatch(getKanbanByGroup())
  }
// 修改分组
export const onChangeSortByGroupOptions =
  (key: Options['key']) => async (dispatch: AppDispatch) => {
    await dispatch(setSortByGroupOptions(key))
    dispatch(getKanbanByGroup())
  }
// 修改列
export const onChangeSortByRowAndStatusOptions =
  (key: Options['key']) => async (dispatch: AppDispatch) => {
    const res = await dispatch(setSortByRowAndStatusOptions(key))

    dispatch(
      getKanbanConfig({
        id: parseInt(key, 10),
        project_id: getParamsValueByKey('id'),
      }),
    )
    dispatch(getKanbanByGroup())
  }
// 删除视图
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

export const onFilter = () => async (dispatch: AppDispatch) => {
  dispatch(getKanbanByGroup())
}

// 看板配置列表
export const getKanbanConfigList = createAsyncThunk(
  `${name}/getKanbanConfigList`,
  async (param: API.KanbanConfig.GetKanbanConfigList.Params, { dispatch }) => {
    const res = await services.kanbanConfig.getKanbanConfigList(param)
    const { data } = res
    const sortByRowAndStatusOptions = data.map(item => {
      return {
        check: false,
        value: item.name,
        key: item.id + '',
      }
    })
    if (sortByRowAndStatusOptions.length) {
      sortByRowAndStatusOptions[0].check = true
    }
    const checked = sortByRowAndStatusOptions[0]
    if (checked) {
      dispatch(
        getKanbanConfig({
          id: parseInt(checked.key, 10),
          project_id: getParamsValueByKey('id'),
        }),
      )
    }
    return {
      kanbanConfigList: res.data,
      sortByRowAndStatusOptions,
    }
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
    const checked = sortByView?.find(
      item => item.check && ret.some(i => i.id === item.id),
    )
    if (checked) {
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
    }
    ret[0].check = true
    const config = ret[0]?.config ?? {}
    const params = generatorFilterParams(config)
    dispatch(onTapSearchChoose(params))
    return ret
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
    getMessage({ msg: i18n.t('common.saveSuccess'), type: 'success' })
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
