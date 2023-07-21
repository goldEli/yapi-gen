/* eslint-disable no-useless-computed-key */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

// 大设置

import * as http from '@/tools/http'
import normalCompany from '/normalCompany.jpg'

export const getCompanyInfo: any = async () => {
  const response: any = await http.get<any>('getCompanyInfo')
  return {
    name: response.data.name,
    logo: response.data.logo?.length ? response.data.logo : normalCompany,
    id: response.data.id,
    info: response.data.info,
    projectCount: response.data.project_count,
    userCount: response.data.user_count,
  }
}

export const getOperateLogs: any = async (params: any) => {
  const response: any = await http.get<any>('getOperateLogs', {
    search: {
      user_id: params.userIds,
      method: params.types,
      created_at: params.times,
    },
    pagesize: params.pageSize,
    page: params.page,
    orderkey: params.orderKey,
    order: params.order,
  })
  return {
    currentPage: params.page,
    pageSize: Number(params.pageSize),
    total: response.data.pager.total,
    list: response.data.list.map((i: any) => ({
      id: i.id,
      name: i.name || i.nickname,
      time: i.created_at,
      info: i.content,
      type: i.method,
      avatar: i.avatar,
    })),
  }
}

export const getLoginLogs: any = async (params: any) => {
  const response: any = await http.get<any>('getLoginLogs', {
    search: {
      user_id: params.userIds,
      created_at: params.times,
    },
    pagesize: params.pageSize,
    page: params.page,
    orderkey: params.orderKey,
    order: params.order,
  })

  return {
    currentPage: params.page,
    pageSize: Number(params.pageSize),
    total: response.data.pager.total,
    list: response.data.list.map((i: any) => ({
      id: i.id,
      nickname: i.nickname,
      system: i.system,
      client: i.client,
      loginIp: i.ip,
      username: i.name,
      status: i.login_status,
      time: i.created_at,
    })),
  }
}

export const getRoleList: any = async () => {
  const response: any = await http.get<any>('getRoleList')
  return {
    list: response.data.map((i: any) => ({
      id: i.id,
      name: i.content_txt || i.name,
      type: i.type,
    })),
  }
}

export const getRolePermission: any = async (params: any) => {
  const response: any = await http.get<any>('getRolePermission', {
    role_id: params.roleId,
  })
  return {
    list: response.data.map((i: any) => ({
      name: i.group_content_txt,
      children: i.permissions.map((k: any) => ({
        label: k.content_txt,
        groupName: k.group_name,
        value: k.id,
        checked: k.checked,
        isShow: k.is_show,
      })),
    })),
  }
}

export const setRolePermission: any = async (params: any) => {
  await http.put<any>('setRolePermission', {
    role_id: params.roleId,
    permission_ids: params.permissionIds,
  })
}

export const addRole: any = async (params: any) => {
  const response = await http.post<any>('addRole', {
    name: params.name,
  })

  return response
}

export const deleteRole: any = async (params: any) => {
  await http.delete<any>(`/b/company/role/${params.id}`)
}

export const updateRole: any = async (params: any) => {
  await http.put<any>(`/b/company/role/${params.id}`, {
    name: params.name,
  })
}

// 水印开关控制

export const changeWater: any = async (params: any) => {
  const res = await http.post<any>('/b/company/config/save', params)
  return res
}

// 查询配置
export const getWater: any = async () => {
  const response = await http.get<any>('/b/company/config/info')

  return {
    id: response.data.list[0].id,
    status: response.data.list[0].status,
  }
}

// 新增团队
export const addTeams: any = async (params: any) => {
  const response = await http.post<any>('/b/company/teams', params)
  return response
}

// 添加成员弹窗
export const getDepartmentUserList: any = async (params: any) => {
  const response = await http.get<any>('/b/user/department_user_list', params)
  return response?.data
}
export const getDepartmentUserList1: any = async (params: any) => {
  const response = await http.get<any>('/b/user/department_user_list', params)
  return response?.data
}

// 解散团队
export const dismissTeams: any = async (id: any) => {
  const response = await http.delete<any>(`/b/company/teams/${id}`)
  return response
}

// 编辑团队
export const editTeams: any = async (id: any, params: any) => {
  const response = await http.patch<any>(`/b/company/teams/${id}`, params)
  return response
}

// 团队列表
export const companyTeamsList: any = async () => {
  const response = await http.get<any>('/b/company/teams')
  return response
}

// 拖拽排序
export const moveTeamsList: any = async (ids: string | number[]) => {
  const response = await http.put<any>('/b/company/teams/move_sort', { ids })
  return response
}

// 添加团队成员
export const teamsMember: any = async (parmas: any) => {
  const response = await http.post<any>('/b/company/teams/member', parmas)
  return response
}

// 移出团队成员
export const deleteMemberList: any = async (parmas: any) => {
  const response = await http.delete<any>('/b/company/teams/member', parmas)
  return response
}

// 团队成员列表
export const getMemberList: any = async (parmas: any) => {
  const response = await http.get<any>('/b/company/teams/member', parmas)
  return response
}

// 团队成员权限变更
export const changeMemberRole: any = async (parmas: any) => {
  const response = await http.put<any>('/b/company/teams/member_change', parmas)
  return response
}
