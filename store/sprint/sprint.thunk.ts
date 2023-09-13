import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

const name = 'sprint'

// 任务列表列表
export const getSprintKanBanList = createAsyncThunk(
  `${name}/getSprintKanBanList`,
  async () => {
    const res = await services.sprint.getSprintKanBanList({ id: 123 })

    return res.data.list
  },
)

// 获取项目权限角色列表
export const getProjectRoleList = createAsyncThunk(
  `${name}/getProjectRoleList`,
  async (params: API.Sprint.GetProjectRoleList.Params) => {
    const res = await services.sprint.getProjectRoleList(params)
    return res.data
  },
)

// 冲刺左边的列表数据
export const getLeftSprintList = createAsyncThunk(
  `${name}/getLeftSprintList`,
  async (params: API.Sprint.SprintList.Params) => {
    const res = await services.sprint.getLeftSprintList(params)
    return res
  },
)

// 冲刺右边的列表数据
export const getRightSprintList = createAsyncThunk(
  `${name}/getRightSprintList`,
  async (params: API.Sprint.SprintGroupList.Params) => {
    const res = await services.sprint.getSprintGroupList(params)
    return res
  },
)
// 获取所以的长故事列表

export const getLongStoryList = createAsyncThunk(
  `${name}/getLongStoryList`,
  async (params: API.Sprint.getLongStoryList.Params) => {
    const res = await services.sprint.getLongStroyList(params)

    return res.data
  },
)
