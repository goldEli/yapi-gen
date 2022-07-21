import * as http from '@/tools/http'

export const getCompanyInfo: any = async () => {
  const response: any = await http.get<any>('getCompanyInfo')
  response.data = {
    id: '1',
    name: '定星科技',
    info: '1212121212121212121212',
    project_count: 10,
    user_count: 20,
    logo: '',
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
  const response: any = await http.get<any>('getOperateLogs', {
    search: {
      user_id: params.userId,
      method: params.method,
      created_at: params.createdAt,
    },
    pagesize: params.pagesize,
    page: params.page,
    orderkey: params.orderkey,
    order: params.order,
  })
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
    ],
    pager: {
      total: 20,
      page: 2,
      pagesize: 12,
    },
  }
  return {
    currentPage: params.page,
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
  const response: any = await http.get<any>('getLoginLogs', {
    search: {
      user_id: params.userId,
      created_at: params.createdAt,
    },
    pagesize: params.pagesize,
    page: params.page,
    orderkey: params.orderkey,
    order: params.order,
  })
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
    ],
    pager: {
      total: 20,
      page: 2,
      pagesize: 12,
    },
  }
  return {
    currentPage: params.page,
    total: response.data.pager.total,
    list: response.data.list.map((i: any) => ({
      id: i.id,
      nickname: i.nickname,
      system: i.system,
      client: i.client,
      loginIp: i.loginIp,
      username: i.username,
      status: i.login_status,
      time: i.time,
    })),
  }
}

export const getRoleList: any = async () => {
  const response: any = await http.get<any>('getRoleList')
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
  const response: any = await http.get<any>('getRolePermission', {
    role_id: params.roleId,
  })
  response.data = {
    group_name: '需求',
    permissions: [
      { id: '0', name: '创建需求' },
      { id: '1', name: '删除需求' },
      { id: '2', name: '编辑需求' },
    ],
  }
  return {
    list: response.data.map((i: any) => ({
      name: i.name,
      children: i.permissions,
    })),
  }
}
