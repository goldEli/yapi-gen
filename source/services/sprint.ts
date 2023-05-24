import urls from '@/constants/urls'
import * as http from '@/tools/http'

export const getSprintKanBanList = async (
  params: API.Sprint.GetSprintList.Params,
) => {
  const response = await http.get<any, API.Sprint.GetSprintList.Result>(
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
// 完成率Top10
export const getCompletionRate = async (
  params: API.Sprint.GetCompletionRate.Params,
) => {
  const response = await http.get<any, API.Sprint.GetCompletionRate.Result>(
    'getCompletionRate',
    params,
  )
  return response.data
}
// 阶段缺陷占比
export const getDefectRatio = async (
  params: API.Sprint.GetDefectRatio.Params,
) => {
  const response = await http.get<any, API.Sprint.GetDefectRatio.Result>(
    'getDefectRatio',
    params,
  )
  return response.data
}
// 缺陷趋势
export const getBugList = async (params: API.Sprint.GetDefectRatio.Params) => {
  const response = await http.get<any, API.Sprint.GetDefectRatio.Result>(
    'getDefectRatio',
    params,
  )
  return response.data
}
