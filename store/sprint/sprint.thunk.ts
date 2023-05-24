import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch } from '@store/index'
import { setSprintDetailDrawer } from '.'
import { setListActiveId } from '@store/global'

const name = 'sprint'

// 任务列表列表
export const getSprintKanBanList = createAsyncThunk(
  `${name}/getSprintKanBanList`,
  async () => {
    const res = await services.sprint.getSprintKanBanList({ id: 123 })

    return res.data.list
  },
)

// 事务列表
export const getSprintList = createAsyncThunk(
  `${name}/getSprintList`,
  async (params: API.Sprint.GetSprintList.Params) => {
    const res = await services.sprint.getSprintList(params)
    return res
  },
)

export const saveSprintDetailDrawer =
  (params: any) => async (dispatch: AppDispatch) => {
    dispatch(setSprintDetailDrawer(params))
    dispatch(setListActiveId(params?.id ?? 0))
  }

// 获取项目权限角色列表
export const getProjectRoleList = createAsyncThunk(
  `${name}/getProjectRoleList`,
  async (params: API.Sprint.GetProjectRoleList.Params) => {
    const res = await services.sprint.getProjectRoleList(params)
    return res.data
  },
)

// 事务详情
export const getSprintInfo = createAsyncThunk(
  `${name}/getSprintInfo`,
  async (params: API.Sprint.GetSprintInfo.Params) => {
    const res = await services.sprint.getSprintInfo(params)
    return res
  },
)

// 事务评论列表
export const getSprintCommentList = createAsyncThunk(
  `${name}/getSprintCommentList`,
  async (params: API.Sprint.GetSprintCommentList.Params) => {
    const res = await services.sprint.getSprintCommentList(params)
    return res
  },
)
