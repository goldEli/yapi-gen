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
  const response = await http.post('checkUpdate', params)
  return response.data
}

// 分享视图
export const shareView = async (params: API.Sprint.GetDefectRatio.Params) => {
  const response = await http.post<any, API.Sprint.GetStatisticsTotal.Result>(
    'shareView',
    params,
  )
  return response.data
}

// 按冲刺分组的事务列表
export const getSprintGroupList = async (
  params: API.Sprint.SprintGroupList.Params,
) => {
  const response = await http.get('getSprintGroupList', params)
  return response.data
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
export const delSprintItem = async (params: API.Sprint.DelSprintItem.id) => {
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
