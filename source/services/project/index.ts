/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '@/tools/http'
import posterImg from '@/assets/poster.png'

export const getProjectList: any = async (params: any) => {

  // const response: any = await http.get<any>('getProjectList', {
  //     search: {
  //         self: params.self,
  //         keyword: params.searchValue,
  //         is_public: params.isPublic,
  //         status: params.status
  //     },
  //     pagesize: params.pagesize,
  //     page: params.page,
  //     orderkey: params.orderkey,
  //     order: params.order,
  // })
  const response: any = {}
  response.data = {
    list: [
      {
        id: '1',
        status: 1,
        cover: posterImg,
        name: '敏捷项目',
        member_count: 20,
        story_count: 10,
        iterate_count: 20,
        progress: '0.5',
        created_at: '2022-01-21',
        stop_at: '2022-2-21',
        user_name: '历史',
      },
      {
        id: '2',
        status: 1,
        cover: posterImg,
        name: '敏捷项目2.0',
        member_count: 20,
        story_count: 10,
        iterate_count: 20,
        progress: '0.5',
        created_at: '2022-01-21',
        stop_at: '2022-2-21',
        user_name: '历史',
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
      status: i.status,
      url: i.cover,
      name: i.name,
      memberCount: i.member_count,
      storyCount: i.story_count,
      iterateCount: i.iterate_count,
      progress: Number(i.progress) * 100,
      createdTime: i.created_at,
      endTime: i.stop_at,
      createName: i.user_name,
    })),
  }
}

export const getTagList: any = async (params: any) => {

  // const response: any = await http.get<any>('getTagList', {
  //   project_id: params.projectId,
  // })
  const response: any = {}
  response.data = [{ id: '0', content: '修改0', color: '#000' }]
  return response.data
}

export const getProjectCoverList: any = async () => {

  // const response: any = await http.get('getProjectCoverList')
  const response: any = {}
  response.data = [{ id: '0', path: '修改0' }]
  return response.data
}

export const getProjectInfo: any = async (params: any) => {

  // const response: any = await http.get<any>('getProjectInfo')
  const response: any = {}
  response.data = {
    status: 1,
    name: '敏捷',
    info: '敏捷描述',
    id: 120,
    created_at: '2011-02-12',
    is_public: 1,
    story_count: 2,
    iterate_count: 12,
    member_count: 32,
    stop_at: '2011-02-12',
    user_name: '何飞',
    cover: posterImg,
  }
  return response.data
}

export const addProject: any = async (params: any) => {
  await http.post<any>('addProject', {
    is_public: params.isPublic,
    name: params.name,
    info: params.info,
    cover: params.url,
  })
}

export const updateProject: any = async (params: any) => {
  await http.put<any>('updateProject', {
    is_public: params.isPublic,
    name: params.name,
    info: params.info,
    cover: params.url,
    id: params.id,
  })
}

export const deleteProject: any = async (params: any) => {
  await http.delete<any>('deleteProject', {
    id: params.id,
  })
}

export const openProject: any = async (params: any) => {
  await http.put<any>('openProject', {
    id: params.id,
  })
}

export const stopProject: any = async (params: any) => {
  await http.put<any>('stopProject', {
    id: params.id,
  })
}

export const getProjectMember: any = async (params: any) => {

  // const response: any = await http.get<any>('getProjectMember', {
  //   search: {
  //     project_id: params.projectId,
  //     keyword: params.searchValue,
  //     all: true,
  //   },
  //   orderkey: params.orderkey,
  //   order: params.order,
  // })
  const response: any = {}
  response.data = {
    list: [
      {
        name: '张三',
        nickname: '敏捷描述',
        id: 0,
        avatar: posterImg,
        position_name: '设计',
        role_name: '普通成员',
      },
    ],
  }
  return response.data.list
}

export const addProjectMember: any = async (params: any) => {
  await http.post<any>('addProjectMember', {
    search: {
      project_id: params.projectId,
      user_group_id: params.userGroupId,
      user_ids: params.userIds,
    },
  })
}

export const updateMemberPermission: any = async (params: any) => {
  await http.put<any>('updateMemberPermission', {
    search: {
      project_id: params.projectId,
      user_group_id: params.userGroupId,
      user_ids: params.userIds,
    },
  })
}

export const deleteMemberPermission: any = async (params: any) => {
  await http.delete<any>('deleteMemberPermission', {
    search: {
      project_id: params.projectId,
      user_id: params.userId,
    },
  })
}

export const getProjectPermission: any = async () => {

  // const response: any = await http.get<any>('getProjectPermission')
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

export const addPermission: any = async (params: any) => {
  await http.post<any>('addPermission', {
    name: params.name,
    project_id: params.projectId,
  })
}

export const deletePermission: any = async (params: any) => {
  await http.delete<any>(`/b/company/role/${params.id}`, {
    project_id: params.projectId,
  })
}

export const updatePermission: any = async (params: any) => {
  await http.put<any>(`/b/company/role/${params.id}`, {
    name: params.name,
    project_id: params.projectId,
  })
}

export const getPermission: any = async (params: any) => {

  // const response: any = await http.get<any>('getPermission', {
  //   role_id: params.roleId,
  // project_id: params.projectId,
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

export const setPermission: any = async (params: any) => {
  await http.put<any>('setPermission', {
    role_id: params.roleId,
    permission_ids: params.permissionIds,
    project_id: params.projectId,
  })
}
