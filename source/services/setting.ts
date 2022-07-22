import * as http from '@/tools/http'
import posterImg from '@/assets/poster.png'

export const getCompanyInfo: any = async () => {
  // const response: any = await http.get<any>('getCompanyInfo')
  const response: any = {}
  response.data = {
    id: '1',
    name: '定星科技',
    info: '1212121212121212121212',
    project_count: 10,
    user_count: 20,
    logo: posterImg,
  }
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
    currentPage: 1, // params.page ||
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
    currentPage: 1, // params.page
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
  // const response: any = await http.get<any>('getRoleList')
  const response: any = {}
  response.data = [
    { name: '管理员', id: 0, type: 1 },
    { name: '编辑者', id: 1, type: 1 },
    { name: '参与者', id: 2, type: 1 },
    { name: '测试组', id: 3, type: 2 },
  ]
  return {
    list: response.data.map((i: any) => ({
      id: i.id,
      name: i.name,
      type: i.type,
    })),
  }
}

export const getRolePermission: any = async (params: any) => {
  // const response: any = await http.get<any>('getRolePermission', {
  //   role_id: params.roleId,
  // })
  const response: any = {}
  response.data = [
    {
      group_name: '需求',
      permissions: [
        { value: '01', label: '创建需求' },
        { value: '11', label: '删除需求' },
        { value: '21', label: '编辑需求' },
      ],
    },
    {
      group_name: '迭代',
      permissions: [
        { value: '41', label: '迭代创建需求' },
        { value: '51', label: '迭代删除需求' },
        { value: '61', label: '迭代编辑需求' },
      ],
    },
  ]
  return {
    list: response.data.map((i: any) => ({
      name: i.group_name,
      children: i.permissions,
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
