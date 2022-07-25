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

  // const response: any = await http.get<any>('getOperateLogs', {
  //   search: {
  //     user_id: params.userId,
  //     method: params.method,
  //     created_at: params.createdAt,
  //   },
  //   pagesize: params.pagesize,
  //   page: params.page,
  //   orderkey: params.orderkey,
  //   order: params.order,
  // })
  const response: any = {}
  response.data = {
    list: [
      {
        id: '1',
        content: '【新增项目】项目名称【项目 XXXXXX】',
        method: 'put',
        name: '张三',
        nickname: '里斯',
        updated_at: '2022-01-12',
      },
      {
        id: '2',
        content: '【编辑项目】项目名称【项目 XXXXXX】',
        method: 'post',
        name: '小米',
        nickname: '大卫',
        updated_at: '2022-01-01',
      },
    ],
    pager: {
      total: 20,
      page: 2,
      pagesize: 12,
    },
  }
  return {
    currentPage: 1,
    total: response.data.pager.total,
    list: response.data.list.map((i: any) => ({
      id: i.id,
      name: i.name || i.nickname,
      time: i.updated_at,
      info: i.content,
      type: i.method,
    })),
  }
}

export const getLoginLogs: any = async (params: any) => {

  // const response: any = await http.get<any>('getLoginLogs', {
  //   search: {
  //     user_id: params.userId,
  //     created_at: params.createdAt,
  //   },
  //   pagesize: params.pagesize,
  //   page: params.page,
  //   orderkey: params.orderkey,
  //   order: params.order,
  // })
  const response: any = {}
  response.data = {
    list: [
      {
        id: '1',
        client: '火狐',
        system: 'win10',
        name: '张三',
        nickname: '里斯',
        created_at: '2022-01-12',
        ip: '192.168.1.10',
        login_status: 1,
      },
    ],
    pager: {
      total: 20,
      page: 2,
      pagesize: 12,
    },
  }
  return {
    currentPage: 1,
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
      name: i.name,
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
      name: i.group_name,
      children: i.permissions.map((k: any) => ({
        label: k.name,
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
  await http.post<any>('addRole', {
    name: params.name,
  })
}

export const deleteRole: any = async (params: any) => {
  await http.delete<any>(`/b/company/role/${params.id}`)
}

export const updateRole: any = async (params: any) => {
  await http.put<any>(`/b/company/role/${params.id}`, {
    name: params.name,
  })
}
