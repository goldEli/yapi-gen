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
  setKanbanInfoByGroup,
  setMovingStory,
  setModifyStatusModalInfo,
  setFullScreen,
  // setViewItemConfig,
} from '.'
import { getMessage } from '@/components/Message'
import { getProjectIdByUrl } from '@/tools'
import i18n from 'i18next'
import { onTapSearchChoose, saveValue } from '@store/view'
import { generatorFilterParams } from './utils'
import _ from 'lodash'
import { Options } from '@/components/SelectOptionsNormal'
import { produce } from 'immer'
import { ViewItem } from '@/views/ProjectSetting/components/KanBanSetting/SelectOptions'

const name = 'kanBan'

export const copyView =
  (params: API.Kanban.CopyView.Params) => async (dispatch: AppDispatch) => {
    if (!params.id) {
      return null
    }
    const res = await services.kanban.copyView(params)
    return res.data
  }

// 触发全屏模式
export const onFullScreenMode = () => async (dispatch: AppDispatch) => {
  dispatch(setFullScreen(true))
}
// 关闭全屏模式
export const offFullScreenMode = () => async (dispatch: AppDispatch) => {
  dispatch(setFullScreen(false))
}

// 删除story
export const deleteStory =
  (params: Pick<API.Kanban.DeleteStory.Params, 'id'>) =>
  async (dispatch: AppDispatch) => {
    await services.kanban.deleteStory({
      ...params,
      project_id: getProjectIdByUrl(),
    })
    dispatch(getKanbanByGroup())
  }

// 获取流转配置
export const getFlowConfig =
  (params: API.Kanban.GetFlowConfig.Params) =>
  async (dispatch: AppDispatch) => {
    const res = await services.kanban.getFlowConfig(params)

    return res.data
  }

// 打开修改状态弹窗
export const openModifyStatusModalInfo =
  (params: {
    info: Model.Project.CheckStatusItem
    storyId: Model.KanBan.Story['id']
  }) =>
  async (dispatch: AppDispatch) => {
    dispatch(
      setModifyStatusModalInfo({
        visible: true,
        ...params,
      }),
    )
  }

// 关闭修改状态弹窗
export const closeModifyStatusModalInfo =
  () => async (dispatch: AppDispatch) => {
    dispatch(
      setModifyStatusModalInfo({
        visible: false,
      }),
    )

    /**
     * 看板数据更新后，卡片的位置没有更新，手动触发滚动条触发
     */
    const dom = document.querySelector('#kanbanContainer')
    if (!dom) return
    // 获取元素滚动条的当前位置
    var scrollPosition = dom?.scrollTop
    dom.scrollTop = scrollPosition + 1
  }
// 状态改变同步到服务端
export const saveModifyStatusModalInfo =
  (params: API.Affairs.UpdateAffairsStatus.Params) =>
  async (dispatch: AppDispatch) => {
    const { modifyStatusModalInfo } = store.getState().kanBan
    const res = await services.affairs.updateAffairsStatus({
      ...params,
      nId: modifyStatusModalInfo.storyId,
      projectId: getProjectIdByUrl(),
    })

    dispatch(getKanbanByGroup())
  }
// 状态改变
export const modifyStatus =
  (options: {
    columnId: Model.KanBan.Column['id']
    groupId: Model.KanBan.Group['id']
    targetColumnId: Model.KanBan.Column['id']
    targetGroupId: Model.KanBan.Group['id']
    storyId: Model.KanBan.Story['id']
    source: Model.KanbanConfig.Status
    target: Model.KanbanConfig.Status
  }) =>
  async (dispatch: AppDispatch) => {
    const { kanbanInfoByGroup } = store.getState().kanBan
    const { source, target, storyId } = options
    const data = produce(kanbanInfoByGroup, draft => {
      const stories =
        draft
          .find(item => item.id === options.groupId)
          ?.columns.find(item => item.id === options.columnId)?.stories ?? []
      const index = stories.findIndex(item => item.id === options.storyId)
      const [removed] = stories.splice(index, 1)
      const targetStories =
        draft
          .find(item => item.id === options.targetGroupId)
          ?.columns.find(item => item.id === options.targetColumnId)?.stories ??
        []
      targetStories.unshift(removed)
    })
    dispatch(setKanbanInfoByGroup(data))
    const res = await dispatch(
      getFlowConfig({
        story_id: options.storyId,
        // 项目id
        project_id: getProjectIdByUrl(),
        // 目标状态id
        category_status_to_id: target.flow_status_id,
      }),
    )
    dispatch(
      openModifyStatusModalInfo({
        storyId,
        info: {
          // 可流转的状态列表
          content: target.status_name,
          // 来自id状态名称
          fromContent: source.status_name,
          // 流转名称
          statusName: res.name,
          // 来自id
          fromId: source.flow_status_id,
          // 来自id是否是结束状态
          fromIsEnd: source.is_end,
          // 来自id是否是开始状态
          fromIsStart: source.is_start,
          // 流转到id
          id: target.flow_status_id,
          // 需求id、事务id、缺陷id
          infoId: storyId,
          // 流转到id是否是结束状态
          is_end: target.is_end,
          // 流转到id是否是结束状态
          is_start: target.is_start,
          // 项目id
          projectId: getProjectIdByUrl(),
        },
      }),
    )

    dispatch(setMovingStory(null))
  }
// 同列修改优先级
export const modifyPriority =
  (options: {
    sourceColumnId: Model.KanBan.Column['id']
    sourceGroupId: Model.KanBan.Group['id']

    targetColumnId: Model.KanBan.Column['id']
    targetGroupId: Model.KanBan.Group['id']
    startIndex: number
    targetIndex: number
  }) =>
  async (dispatch: AppDispatch) => {
    const {
      sourceColumnId,
      sourceGroupId,

      targetColumnId,
      targetGroupId,
      startIndex,
      targetIndex,
    } = options
    const { kanbanInfoByGroup } = store.getState().kanBan
    const data = produce(kanbanInfoByGroup, draft => {
      const sourceStories =
        draft
          .find(item => item.id === sourceGroupId)
          ?.columns.find(item => item.id === sourceColumnId)?.stories ?? []
      const [removed] = sourceStories.splice(startIndex, 1)
      const targetStories =
        draft
          .find(item => item.id === targetGroupId)
          ?.columns.find(item => item.id === targetColumnId)?.stories ?? []

      targetStories.splice(targetIndex, 0, removed)
    })
    await dispatch(setKanbanInfoByGroup(data))
    const storyId = kanbanInfoByGroup
      .find(item => item.id === sourceGroupId)
      ?.columns.find(item => item.id === sourceColumnId)?.stories[startIndex].id
    if (!!storyId) {
      await dispatch(
        updateStoryPriority({
          id: storyId,
          priority: targetGroupId,
        }),
      )
    }
    dispatch(
      sortStoryServer({
        kanban_column_id: options.sourceColumnId,
      }),
    )
    dispatch(
      sortStoryServer({
        kanban_column_id: options.targetColumnId,
      }),
    )
  }

// 同组同列排序
export const sortStory =
  (options: {
    storyId: Model.KanBan.Story['id']
    columnId: Model.KanBan.Column['id']
    groupId: Model.KanBan.Group['id']
    startIndex: number
    destinationIndex: number
  }) =>
  async (dispatch: AppDispatch) => {
    const { kanbanInfoByGroup } = store.getState().kanBan
    const data = produce(kanbanInfoByGroup, draft => {
      const stories =
        draft
          .find(item => item.id === options.groupId)
          ?.columns.find(item => item.id === options.columnId)?.stories ?? []
      const [removed] = stories.splice(options.startIndex, 1)
      stories.splice(options.destinationIndex, 0, removed)
    })
    await dispatch(setKanbanInfoByGroup(data))
    dispatch(
      sortStoryServer({
        kanban_column_id: options.columnId,
      }),
    )
  }

// 修改权限
export const updateStoryPriority =
  (params: Pick<API.Kanban.UpdateStoryPriority.Params, 'id' | 'priority'>) =>
  async (dispatch: AppDispatch) => {
    const res = await services.kanban.updateStoryPriority({
      project_id: getProjectIdByUrl(),
      ...params,
    })
  }

// 更新排序同步到服务端
export const sortStoryServer =
  (
    options: Pick<API.Kanban.ModifyKanbanIssueSort.Params, 'kanban_column_id'>,
  ) =>
  async (dispatch: AppDispatch) => {
    const { kanbanInfoByGroup } = store.getState().kanBan
    const ids: number[] = []
    kanbanInfoByGroup.forEach(group => {
      group.columns.forEach(column => {
        if (column.id === options.kanban_column_id) {
          ids.push(...column.stories.map(story => story.id))
        }
      })
    })
    const params: API.Kanban.ModifyKanbanIssueSort.Params = {
      kanban_column_id: options.kanban_column_id,
      story_ids: ids,
      project_id: getProjectIdByUrl(),
    }
    await services.kanban.modifyKanbanIssueSort(params)
    dispatch(getKanbanByGroup())
  }

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
    const projectId = getProjectIdByUrl()
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
    const projectId = getProjectIdByUrl()
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
      project_id: getProjectIdByUrl(),
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
        project_id: getProjectIdByUrl(),
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
    dispatch(getStoryViewList(null))
  }

// 创建视图
export const createView =
  (params: Omit<API.Kanban.CreateView.Params, 'use_type'>) =>
  async (dispatch: AppDispatch) => {
    const project_id = getProjectIdByUrl()
    const res = await services.kanban.createView({
      ...params,
      config: store.getState().view,
      project_id,
      use_type: 2,
    })
    getMessage({ msg: i18n.t('common.saveSuccess') as string, type: 'success' })
    await dispatch(getStoryViewList(null))
    dispatch(onChangeSortByView(res.data.id))
  }

export const updateView =
  (params: API.Kanban.UpdateView.Params) => async (dispatch: AppDispatch) => {
    await services.kanban.updateView(params)
    getMessage({ msg: i18n.t('common.editSuccess') as string, type: 'success' })
    dispatch(getStoryViewList(null))
  }

export const onFilter = () => async (dispatch: AppDispatch) => {
  setTimeout(() => {
    dispatch(getKanbanByGroup())
  })
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
          project_id: getProjectIdByUrl(),
        }),
      )
    }
    return {
      kanbanConfigList: res.data,
      sortByRowAndStatusOptions,
    }
  },
)

// 刷新看板
export const onRefreshKanBan = () => async (dispatch: AppDispatch) => {
  dispatch(getKanbanByGroup())
}

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
  // 指定当前视图
  async (viewId: Model.KanBan.ViewItem['id'] | null, { dispatch }) => {
    const project_id = getProjectIdByUrl()
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
    // 用户已经选中过，需要恢复
    let checked = sortByView?.find(
      item => item.check && ret.some(i => i.id === item.id),
    )
    if (checked) {
      checked.check = true
    } else {
      // 如果第一次加载 默认第一个
      ret[0].check = true
      checked = ret[0]
    }
    const params = generatorFilterParams(checked?.config)
    dispatch(onTapSearchChoose(params))
    return ret
  },
)

// 保存视图
export const onSaveAsViewModel =
  (data: Partial<ViewItem>) => async (dispatch: AppDispatch) => {
    dispatch(
      createView({
        name: data.value ?? '',
        project_id: getProjectIdByUrl(),
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

  getMessage({ msg: i18n.t('common.saveSuccess'), type: 'success' })

  dispatch(closeSaveAsViewModel())
}
