import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch } from '@store/index'
import { setSprintDetailDrawer } from '.'
import { setListActiveId } from '@store/global'

const name = 'sprint'

// // 任务列表列表
// export const getSprintKanBanList = createAsyncThunk(
//   `${name}/getSprintKanBanList`,
//   async () => {
//     const res = await services.sprint.getSprintKanBanList({ id: 123 })

//     return res.data.list
//   },
// )

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
