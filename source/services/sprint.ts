/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/no-loss-of-precision */
// eslint-disable max-lines
import * as http from '@/tools/http'
export const getSprintKanBanList = async (
  params: API.Sprint.GetSprintKanBanList.Params,
) => {
  const response = await http.get<any, API.Sprint.GetSprintKanBanList.Result>(
    'getSprintKanBanList',
    params,
  )
  return response
}

// 获取权限
export const getProjectRoleList = async (
  params: API.Sprint.GetProjectRoleList.Params,
) => {
  const response = await http.get<any, API.Sprint.GetProjectRoleList.Result>(
    `/b/project/role?project_id=${params.project_id}`,
    params,
  )
  return response
}

// 修改权限角色
export const updateProjectRole = (
  params: API.Sprint.GetProjectRoleList.updateParams,
) => http.put<any, API.Sprint.GetProjectRoleList.Result>('updateMember', params)

// 修改项目首页配置
export const updateHomeSetting = (
  params: API.Sprint.UpdateHomeSetting.Params,
) =>
  http.put<any, API.Sprint.UpdateHomeSetting.Result>(
    'updateHomeSetting',
    params,
  )

// 检查是否保存视图
export const checkUpdates = async (params: API.Sprint.CheckUpdate.Params) => {
  const response = await http.post<any, API.Sprint.CheckUpdate.Result>(
    'checkUpdate',
    params,
  )
  return response.data
}

// 分享视图
export const shareView = async (params: API.Sprint.ShareView.Params) => {
  const response = await http.post<any, API.Sprint.ShareView.Result>(
    'shareView',
    params,
  )
  return response
}

// 按冲刺分组的事务列表
export const getSprintGroupList = async (
  params: API.Sprint.SprintGroupList.Params,
) => {
  const response = await http.get('getSprintGroupList', params)
  return {
    ...response.data,
    parent: [
      { value: response.data.parent.id, label: response.data.parent.name },
    ],
  }
}
// 冲刺左边列表
export const getLeftSprintList = async (
  params: API.Sprint.SprintList.Params,
) => {
  const response = await http.get('getLeftSprintList', params)
  return response.data
}

// 新建冲刺
export const createSprint = async (params: API.Sprint.CreateSprint.Params) => {
  const response = await http.post('createSprint', params)
  return response
}

// 冲刺详情
export const getSprintDetail = async (
  params: API.Sprint.GetSprintDetail.Params,
) => {
  const response = await http.get('getSprintDetail', params)
  return response
}

// 编辑冲刺
export const updateSprintInfo = async (
  params: API.Sprint.UpdateSprintInfo.Params,
) => {
  const response = await http.patch('updateSprintInfo', params)
  return response
}

// 删除冲刺
export const delSprintItem = async (
  params: API.Sprint.DelSprintItem.Params,
) => {
  const response = await http.delete('delSprintItem', params)
  return response
}

export const getLongStroyList = async (
  params: API.Sprint.getLongStoryList.Params,
) => {
  const response = await http.get<any, API.Sprint.getLongStoryList.Result>(
    'getLongStoryList',
    params,
  )
  return response
}
// 完成冲刺
export const completeSprint = async (
  params: API.Sprint.CompleteSprint.Params,
) => {
  const response = await http.put('completeSprint', params)
  return response
}

// 拖动--更换冲刺
export const moveStory = async (params: API.Sprint.MoveStory.Params) => {
  const response = await http.post('moveStory', params)
  return response
}

// 拖动排序冲刺
export const sortStory = async (params: API.Sprint.SortStory.Params) => {
  const response = await http.put('sortStory', params)
  return response
}

// 长故事下拉列表
export const getLongStory = async (params: API.Sprint.GetLongStory.Params) => {
  const response = await http.get('getLongStory', params)
  return response
}

// 长故事下拉列表
export const getMoveTo = async (params: API.Sprint.GetMoveTo.Params) => {
  const response = await http.get<any, API.Sprint.GetMoveTo.Result>(
    'getMoveTo',
    params,
  )
  return response.data
}
