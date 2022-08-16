/* eslint-disable no-useless-computed-key */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '@/tools/http'

export const getCompanyInfo: any = async () => {
  const response: any = await http.get<any>('getCompanyInfo')
  return {
    name: response.data.name,
    logo: response.data.logo,
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
    total: response.data.pager.total,
    list: response.data.list.map((i: any) => ({
      id: i.id,
      name: i.name || i.nickname,
      time: i.created_at,
      info: i.content,
      type: i.method,
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
        value: k.id,
        checked: k.checked,
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
