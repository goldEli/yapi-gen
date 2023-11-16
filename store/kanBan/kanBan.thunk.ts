import { First } from './../../source/views/SiteNotifications/Setting/style'
/* eslint-disable max-depth */
/* eslint-disable no-undefined */
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
  setSpinning,
  setkanbanConfig,
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
import {
  getNewkanbanConfig,
  getNewkanbanGroups,
  getNewkanbanStoriesOfPaginate,
  getNewstoriesOfGroupFirstPage,
} from '@/services/kanban'
import useGroupType from '@/views/KanBanBoard/hooks/useGroupType'

const name = 'kanBan'

export const copyView =
  (params: API.Kanban.CopyView.Params) => async (dispatch: AppDispatch) => {
    if (!params.id) {
      return null
    }
    const res = await services.kanban.copyView(params)
    return res.data
  }
export const deleteKanbanGroup =
  (params: { id: number }) => async (dispatch: AppDispatch) => {
    console.log(params, '删除分组这里不用改')

    const res = await services.kanban.deleteKanbanGroup({
      ...params,
      project_id: getProjectIdByUrl(),
    })
    dispatch(setKanbanInfoByGroup([]))
    dispatch(getKanbanByGroup())
    return res
  }
// 触发全屏模式
export const onFullScreenMode = () => async (dispatch: AppDispatch) => {
  dispatch(setFullScreen(true))
}
// 关闭全屏模式
export const offFullScreenMode = () => async (dispatch: AppDispatch) => {
  dispatch(setFullScreen(false))
}

function findAndReplace(groupId: any, issuesId: any, array: any, cId: any) {
  const cc = JSON.parse(JSON.stringify(array))
  for (let i = 0; i < cc.length; i++) {
    if (cc[i].id === groupId) {
      for (let b = 0; b < cc[i].columns.length; b++) {
        if (cc[i].columns[b].id === cId) {
          for (let c = 0; c < cc[i].columns[b].stories.length; c++) {
            if (cc[i].columns[b].stories[c].id === issuesId) {
              cc[i].columns[b].stories.splice(c, 1)
            }
          }
        }
      }
    }
  }

  return cc
}

// 删除story
export const deleteStory =
  (
    params: Pick<API.Kanban.DeleteStory.Params, 'id' | 'groupId' | 'columnId'>,
    type: number,
  ) =>
  async (dispatch: AppDispatch) => {
    // 根据类型判断是删除哪种
    if (type === 2) {
      await services.affairs.deleteAffairs({
        ...params,
        projectId: getProjectIdByUrl(),
      })
    } else if (type === 1) {
      await services.kanban.deleteStory({
        ...params,
        project_id: getProjectIdByUrl(),
      })
    } else if (type === 3) {
      await services.flaw.deleteFlaw({
        ...params,
        projectId: getProjectIdByUrl(),
      })
    }
    getMessage({ msg: i18n.t('common.deleteSuccess'), type: 'success' })

    dispatch(
      setKanbanInfoByGroup(
        findAndReplace(
          params.groupId,
          params.id,
          store.getState().kanBan.kanbanInfoByGroup,
          params.columnId,
        ),
      ),
    )
    updateKanbanConfigbig()
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
    groupId: Model.KanBan.Group['id']
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
    // const dom = document.querySelector('#kanbanContainer')
    // if (!dom) return
    // // 获取元素滚动条的当前位置
    // var scrollPosition = dom?.scrollTop
    // dom.scrollTop = scrollPosition + 1
  }
// 状态改变同步到服务端
export const saveModifyStatusModalInfo =
  (params: API.Affairs.UpdateAffairsStatus.Params) =>
  async (dispatch: AppDispatch) => {
    const { modifyStatusModalInfo, sortByGroupOptions } =
      store.getState().kanBan
    const { projectInfo } = store.getState().project
    // 只有按优先级分组才用修改优先级
    const isPriorityGroup = sortByGroupOptions?.find(
      k => k.key === 'priority' && k.check,
    )
    if (isPriorityGroup) {
      await dispatch(
        updateStoryPriority({
          id: modifyStatusModalInfo.storyId ?? 0,
          priority: modifyStatusModalInfo.groupId ?? 0,
        }),
      )
    }
    try {
      let res = null
      if (projectInfo?.projectType === 1) {
        res = await services.demand.updateDemandStatus({
          ...params,
          nId: modifyStatusModalInfo.storyId,
          projectId: getProjectIdByUrl(),
        })
      } else {
        res = await services.affairs.updateAffairsStatus({
          ...params,
          nId: modifyStatusModalInfo.storyId,
          projectId: getProjectIdByUrl(),
        })
      }

      if (res && res.code === 0 && res.data) {
        getMessage({ msg: i18n.t('common.operationSuccess'), type: 'success' })
        setTimeout(() => {
          dispatch(updateKanbanByGroup())
        }, 500)
        return 'finish'
      }
    } catch (error) {
      //
    }
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
    const { kanbanInfoByGroup, sortByGroupOptions } = store.getState().kanBan
    const groupType = sortByGroupOptions?.find(item => item.check)?.key
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
    // dispatch(setKanbanInfoByGroup(data))
    const res = await dispatch(
      getFlowConfig({
        story_id: options.storyId,
        // 项目id
        project_id: getProjectIdByUrl(),
        // 目标状态id
        category_status_to_id: target.flow_status_id,
      }),
    )
    const checkGroup = (groupId: any) => {
      let obj
      switch (groupType) {
        case 'priority':
          obj = {
            priority: groupId,
          }
          break
        case 'users':
          obj = {
            kanban_group_id: groupId,
          }
          break
        case 'category':
          obj = {
            category_id: groupId,
          }
          break
        default:
          // eslint-disable-next-line no-undefined
          obj = undefined
          break
      }
      return obj
    }
    function findAndReplace(groupId: any, array: any, cId: any, newData: any) {
      const cc = JSON.parse(JSON.stringify(array))
      for (let i = 0; i < cc.length; i++) {
        if (cc[i].id === groupId) {
          for (let b = 0; b < cc[i].columns.length; b++) {
            if (cc[i].columns[b].id === cId) {
              cc[i].columns[b].stories = newData
            }
          }
        }
      }
      return cc
    }

    const updateColumn = async () => {
      const cc = JSON.parse(JSON.stringify(kanbanInfoByGroup))
      const res = await getNewkanbanStoriesOfPaginate({
        project_id: getProjectIdByUrl(),
        kanban_column_id: options.columnId,
        search: { ...checkGroup(options.groupId) },
        pagesize: 10,
        page: 1,
      })
      const res2 = await getNewkanbanStoriesOfPaginate({
        project_id: getProjectIdByUrl(),
        kanban_column_id: options.targetColumnId,
        search: { ...checkGroup(options.targetGroupId) },
        pagesize: 10,
        page: 1,
      })

      const bb = findAndReplace(options.groupId, cc, options.columnId, res.list)
      const zx = JSON.parse(JSON.stringify(bb))

      const aa = findAndReplace(
        options.targetGroupId,
        zx,
        options.targetColumnId,
        res2.list,
      )
      dispatch(setKanbanInfoByGroup(aa))

      updateKanbanConfigbig()
    }
    dispatch(
      openModifyStatusModalInfo({
        storyId,
        groupId: options?.targetGroupId,
        info: {
          onConfirm: () => updateColumn(),
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

// 更新故事列表（分组）
export const updateKanbanByGroup = createAsyncThunk(
  `${name}/updateKanbanByGroup`,
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
        : {
            ...valueKey,
            user_id: valueKey.user_name,
            category_id: valueKey.category,
            iterate_id: valueKey.iterate_name,
            custom_field: bbh(valueKey),
            keyword: inputKey,
            schedule_start: valueKey?.schedule?.start,
            schedule_end: valueKey?.schedule?.end,
          },
      project_id: getProjectIdByUrl(),
      kanban_config_id: parseInt(columnId, 10),
    }
    const myres = await getNewkanbanGroups({
      ...params,
      group_by: type,
    })
    store.dispatch(setSpinning(false))
    const newData = store
      .getState()
      .kanBan?.kanbanInfoByGroup?.map((k: any) => {
        const temp = myres.find((s: any) => s.id === k.id)
        return {
          ...temp,
          columns: k.columns,
        }
      })
    return newData
  },
)

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
    // await services.kanban.modifyKanbanIssueSort(params)
    // dispatch(setKanbanInfoByGroup([]))
    // dispatch(getKanbanByGroup())
    // todo 更新个数
    dispatch(updateKanbanByGroup())
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
    const res2 = await getNewkanbanConfig({
      ...params,
      id: undefined,
      kanban_config_id: params.id,
    })
    console.log(res2, 'new看板配置')
    // const res = await services.kanbanConfig.getKanbanConfig(params)
    // console.log(res.data,'第一次获取的看板配置数据');
    return res2
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
function bbh(data: any) {
  const filteredData: any = {}

  for (const key in data) {
    if (key.includes('custom')) {
      filteredData[key] = data[key]
    }
  }
  return filteredData
}

export const updateKanbanConfigbig = async () => {
  const { valueKey, inputKey } = store.getState().view
  const { sortByGroupOptions, sortByRowAndStatusOptions } =
    store.getState().kanBan
  const params = {
    search: isEmpty(valueKey)
      ? {
          all: 1,
          keyword: inputKey,
        }
      : {
          ...valueKey,
          user_id: valueKey.user_name,
          category_id: valueKey.category,
          iterate_id: valueKey.iterate_name,
          custom_field: bbh(valueKey),
          keyword: inputKey,
          schedule_start: valueKey?.schedule?.start,
          schedule_end: valueKey?.schedule?.end,
        },
    project_id: getProjectIdByUrl(),
    kanban_config_id: sortByRowAndStatusOptions?.find(item => item.check)?.key,
  }
  const res_config = await getNewkanbanConfig(params)

  store.dispatch(setkanbanConfig(res_config))
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
        : {
            ...valueKey,
            user_id: valueKey.user_name,
            category_id: valueKey.category,
            iterate_id: valueKey.iterate_name,
            custom_field: bbh(valueKey),
            keyword: inputKey,
            schedule_start: valueKey?.schedule?.start,
            schedule_end: valueKey?.schedule?.end,
          },
      project_id: getProjectIdByUrl(),
      kanban_config_id: parseInt(columnId, 10),
    }
    const res_config = await getNewkanbanConfig(params)
    store.dispatch(setkanbanConfig(res_config))
    if (type === 'none') {
      const firstRes = await getNewstoriesOfGroupFirstPage(params)
      // const res = await services.kanban.getKanban(params)
      // console.log(res.data, 'res.data老的配置')
      store.dispatch(setSpinning(false))

      return [
        {
          // 无分组id
          id: 0,
          name: '',
          content_txt: '',
          // columns: res.data,
          columns: res_config.columns.map((i: any) => {
            return {
              ...i,
              stories: firstRes.filter((k: any) => {
                return i.id === k.id
              })[0].stories,
            }
          }),
        },
      ]
    }

    const myres = await getNewkanbanGroups({
      ...params,
      group_by: type,
    })
    store.dispatch(setSpinning(false))
    // const res = await services.kanban.getKanbanByGroup({
    //   ...params,
    //   group_by: type,
    // })
    // console.log(res.data, 'res.data老的分类')

    const checkGroup = (id: any) => {
      let obj
      switch (type) {
        case 'priority':
          obj = {
            priority: id,
          }
          break
        case 'users':
          obj = {
            kanban_group_id: id,
          }
          break
        case 'category':
          obj = {
            category_id: id,
          }
          break
        default:
          // eslint-disable-next-line no-undefined
          obj = undefined
          break
      }
      return obj
    }
    const getGropuStories = async (id: any, cid: any) => {
      const params2 = {
        search: {
          ...valueKey,
          user_id: valueKey.user_name,
          category_id: valueKey.category,
          iterate_id: valueKey.iterate_name,
          custom_field: bbh(valueKey),
          keyword: inputKey,
          schedule_start: valueKey?.schedule?.start,
          schedule_end: valueKey?.schedule?.end,
          ...{ ...checkGroup(id) },
        },
        kanban_column_id: cid,
        project_id: getProjectIdByUrl(),
        pagesize: 10,
        page: 1,
      }
      const firstRes22 = await getNewkanbanStoriesOfPaginate({
        ...params2,
        // group_by: type,
      })
      return firstRes22.list
    }
    const cc = myres.map((i: any) => {
      return {
        ...i,
        columns: store
          .getState()
          .kanBan?.kanbanConfig?.columns?.map((l: any) => {
            return {
              ...l,
              stories: [],
              // ck: getGropuStories(i.id, l.id),
            }
          }),
      }
    })
    return cc
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
    // 根据视图 设置 分组|列与状态|筛选条件的回显
    const { sortByRowAndStatusOptions } = store.getState().kanBan
    const temp1 = sortByRowAndStatusOptions?.find(k => k.is_default === 1)?.key
    const temp2 = sortByRowAndStatusOptions?.[0]?.key
    await dispatch(
      setSortByGroupOptions(
        current.type === 2 ? 'none' : current?.config?.currentGroupKey,
      ),
    )
    const currentRowAndStatusId =
      current.type === 2
        ? temp1 || temp2
        : sortByRowAndStatusOptions?.some(
            (k: any) => k.key === current?.config?.currentRowAndStatusId,
          )
        ? current?.config?.currentRowAndStatusId
        : temp1 || temp2

    await dispatch(setSortByRowAndStatusOptions(String(currentRowAndStatusId)))
    const params = generatorFilterParams(current.config)
    await dispatch(saveValue(params))
    await dispatch(onTapSearchChoose(params ?? { system_view: 1 }))
    const tempParams: any = {
      id: currentRowAndStatusId,
      project_id: getProjectIdByUrl(),
    }
    // 更新kanbanConfig
    if (currentRowAndStatusId) {
      dispatch(getKanbanConfig(tempParams))
    }
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
    const { sortByGroupOptions, sortByRowAndStatusOptions } =
      store.getState().kanBan
    const currentRowAndStatusId = sortByRowAndStatusOptions?.find(
      k => k.check,
    )?.key
    const currentGroupKey = sortByGroupOptions?.find(k => k.check)?.key
    const res = await services.kanban.createView({
      ...params,
      config: {
        ...store.getState().view,
        currentRowAndStatusId,
        currentGroupKey,
      },
      project_id,
      use_type: 2,
    })
    getMessage({ msg: i18n.t('common.saveSuccess') as string, type: 'success' })
    await dispatch(getStoryViewList(null))

    dispatch(onChangeSortByView(res.data.id))
  }

export const updateView =
  (params: Omit<API.Kanban.UpdateView.Params, 'use_type'>) =>
  async (dispatch: AppDispatch) => {
    const project_id = getProjectIdByUrl()
    const { sortByGroupOptions, sortByRowAndStatusOptions } =
      store.getState().kanBan
    const currentRowAndStatusId = sortByRowAndStatusOptions?.find(
      k => k.check,
    )?.key
    const currentGroupKey = sortByGroupOptions?.find(k => k.check)?.key
    const res = await services.kanban.updateView({
      ...params,
      config: {
        ...store.getState().view,
        currentRowAndStatusId,
        currentGroupKey,
      },
      project_id,
      use_type: 2,
    })
    getMessage({ msg: i18n.t('common.editSuccess') as string, type: 'success' })

    dispatch(getStoryViewList(params.id))
  }

export const onFilter = () => async (dispatch: AppDispatch) => {
  dispatch(setKanbanInfoByGroup([]))
  setTimeout(() => {
    dispatch(getKanbanByGroup())
  })
}

// 看板配置列表
export const getKanbanConfigList = createAsyncThunk(
  `${name}/getKanbanConfigList`,
  async (
    param: API.KanbanConfig.GetKanbanConfigList.Params & {
      showId?: number
    },
    { dispatch },
  ) => {
    const res = await services.kanbanConfig.getKanbanConfigList(param)
    const { data } = res
    const sortByRowAndStatusOptions = data.map(item => {
      return {
        check: param.showId === item.id,
        value: item.name,
        key: item.id + '',
        is_default: item.is_default,
      }
    })
    if (sortByRowAndStatusOptions.length && !param.showId) {
      sortByRowAndStatusOptions[0].check = true
    }
    const checked = sortByRowAndStatusOptions.find(item => item.check)
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
  dispatch(setKanbanInfoByGroup([]))
  const data = store.getState().kanBan.sortByRowAndStatusOptions
  const checked = data?.find(item => item.check)
  if (!checked) {
    return
  }
  dispatch(getKanbanByGroup())
  dispatch(
    getKanbanConfig({
      id: parseInt(checked.key, 10),
      project_id: getProjectIdByUrl(),
    }),
  )
}

export const openSaveAsViewModel =
  (id?: Model.KanBan.ViewItem['id'], type?: boolean, isCreate?: boolean) =>
  async (dispatch: AppDispatch) => {
    const { sortByView } = store.getState()?.kanBan
    const viewItem = sortByView?.find(item => item?.id === id)
    if (type && viewItem) {
      dispatch(setSaveAsViewModelInfo({ visible: false, viewItem }))
      dispatch(
        onSaveAsViewModel({
          ...viewItem,
        }),
      )
    } else {
      dispatch(setSaveAsViewModelInfo({ visible: true, viewItem, isCreate }))
    }
  }

export const closeSaveAsViewModel = () => async (dispatch: AppDispatch) => {
  dispatch(
    setSaveAsViewModelInfo({
      visible: false,
      viewItem: { id: 0, name: '', check: false, type: 1, status: 1 },
    }),
  )
}

// 视图列表
export const getStoryViewList = createAsyncThunk(
  `${name}/getStoryViewList`,
  // 指定当前视图id
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
    let checked = ret?.find(item => {
      return sortByView?.some(i => i.id === item.id && item.check)
    })
    // 指定打开视图
    if (viewId) {
      checked = ret.find(item => item.id === viewId)
    }
    if (checked) {
      checked.check = true
    } else {
      // 如果第一次加载 默认第一个
      const index = ret.findIndex(item => item.type === 2)
      ret[index].check = true
      checked = ret[index]
    }
    const params = generatorFilterParams(checked?.config)
    dispatch(onTapSearchChoose(params))
    return ret
  },
)

// 保存视图
export const onSaveAsViewModel =
  (data: Partial<ViewItem>) => async (dispatch: AppDispatch) => {
    if (data.id) {
      dispatch(
        updateView({
          name: data.value ?? '',
          project_id: getProjectIdByUrl(),
          id: data.id ?? 0,
          type: 1,
        }),
      )
    } else {
      dispatch(
        createView({
          name: data.value ?? '',
          project_id: getProjectIdByUrl(),
        }),
      )
    }
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
