import urls from '@/constants/urls'
import * as http from '@/tools/http'

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
) => http.put<any, API.Sprint.GetProjectRoleList.Result>(`updateMember`, params)
