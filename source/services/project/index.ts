/* eslint-disable complexity */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '@/tools/http'

export const getProjectList: any = async (params: any) => {
  const response: any = await http.get<any>('getProjectList', {
    search: {
      self: params.self ? 1 : 0,
      keyword: params.searchValue,
      is_public: params?.isPublic ? Number(params.isPublic) : '',
      status: Number(params.status) || '',
      all: params.all ? 1 : 0,
    },
    pagesize: params.pageSize,
    page: params.page,
    orderkey: params.orderKey,
    order: params.order,
  })

  if (params.all) {
    return {
      total: response.data.length,
      list: response.data.map((i: any) => ({
        id: i.id,
        status: i.status,
        cover: i.cover,
        name: i.name,
        memberCount: i.member_count,
        storyCount: i.story_count,
        iterateCount: i.iterate_count,
        progress: i.progress,
        createdTime: i.created_at,
        endTime: i.stop_at,
        createName: i.user_name,
        info: i.info,
        isPublic: i.is_public,
      })),
    }
  }

  return {
    currentPage: params.page,
    total: response.data.pager.total,
    list: response.data.list.map((i: any) => ({
      id: i.id,
      status: i.status,
      cover: i.cover,
      name: i.name,
      memberCount: i.member_count,
      storyCount: i.story_count,
      iterateCount: i.iterate_count,
      progress: i.progress,
      createdTime: i.created_at,
      endTime: i.stop_at,
      createName: i.user_name,
      info: i.info,
      isPublic: i.is_public,
    })),
  }
}

export const getTagList: any = async (params: any) => {
  const response: any = await http.get<any>('getTagList', {
    project_id: params.projectId,
  })
  return response.data
}

export const getProjectCoverList: any = async () => {
  const response: any = await http.get('getProjectCoverList')
  return response.data
}

export const getProjectInfo: any = async (params: any) => {
  const response: any = await http.get<any>('getProjectInfo', {
    id: params.projectId,
  })

  const plainOptions = response.data.storyConfig.display_fidlds
    .filter((item: { group_name: string }) => item.group_name === '基本字段')
    .map(
      (item: {
        title: any
        content: any
        is_default_display: any
        content_txt: any
      }) => {
        return {
          label: item.title,
          value: item.content,
          is_default_display: item.is_default_display,
          labelTxt: item.content_txt,
        }
      },
    )

  const plainOptions2 = response.data.storyConfig.display_fidlds
    .filter(
      (item: { group_name: string }) => item.group_name === '人员与时间字段',
    )
    .map(
      (item: {
        is_default_display: any
        title: any
        content: any
        content_txt: any
      }) => {
        return {
          label: item.title,
          value: item.content,
          is_default_display: item.is_default_display,
          labelTxt: item.content_txt,
        }
      },
    )

  const titleList: any[] = []
  plainOptions
    .filter((item: any) => item.is_default_display === 1)
    .forEach((item: { title: any; value: any }) => {
      titleList.push(item.value)
    })

  const titleList2: any[] = []
  plainOptions2
    .filter((item: any) => item.is_default_display === 1)
    .forEach((item: { title: any; value: any }) => {
      titleList2.push(item.value)
    })

  const filterBasicsList = response.data.storyConfig.filter_fidlds.filter(
    (item: any) => item.is_default_filter === 1,
  )
  const filterSpecialList = response.data.storyConfig.filter_fidlds.filter(
    (item: any) => item.is_default_filter !== 1,
  )

  return {
    cover: response.data.cover,
    name: response.data.name,
    info: response.data.info,
    id: response.data.id,
    userName: response.data.user_name,
    createTime: response.data.created_at,
    demandCount: response.data.story_count,
    iterateCount: response.data.iterate_count,
    memberCount: response.data.member_count,
    endTime: response.data.stop_at,
    isPublic: response.data.is_public,
    status: response.data.status,
    plainOptions,
    plainOptions2,
    titleList,
    titleList2,
    filterBasicsList,
    filterSpecialList,
    filterFelid: response.data.storyConfig.filter_fidlds,
    projectPermissions: response.data.company_permissions,
  }
}

export const addProject: any = async (params: any) => {
  await http.post<any>('addProject', {
    is_public: params?.isPublic,
    name: params.name,
    info: params?.info,
    cover: params?.cover,
  })
}

export const updateProject: any = async (params: any) => {
  await http.put<any>('updateProject', {
    is_public: params.isPublic,
    name: params.name,
    info: params.info,
    cover: params.cover,
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
  const response: any = await http.get<any>('getProjectMember', {
    search: {
      project_id: params.projectId,
      keyword: params?.searchValue,
      all: params?.all ? 1 : 0,
      job_id: params?.jobIds,
      user_group_id: params?.userGroupIds,
    },
    orderkey: params.orderKey,
    order: params.order,
    page: params.page,
    pagesize: params.pageSize,
  })
  if (params.all) {
    return response.data.map((i: any) => ({
      id: i.id,
      avatar: i.avatar,
      name: i.name,
      nickname: i.nickname,
      positionName: i.position_name,
      roleName: i.role_name,
    }))
  } else {
    return {
      currentPage: params.page,
      total: response.data.pager.total,
      list: response.data.list.map((i: any) => ({
        id: i.id,
        avatar: i.avatar,
        name: i.name,
        nickname: i.nickname,
        gender: i.gender,
        departmentName: i.department_name,
        positionName: i.position_name,
        roleName: i.role_name,
        joinTime: i.created_at,
        userGroupId: i.user_group_id,
        userIds: i.id,
        phone: i.phone,
        email: i.email,
      })),
    }
  }
}

export const addMember: any = async (params: any) => {
  await http.post<any>('addProjectMember', {
    project_id: Number(params.projectId),
    user_group_id: params.userGroupId,
    user_ids: params.userIds,
  })
}

export const updateMember: any = async (params: any) => {
  await http.put<any>('updateMember', {
    project_id: Number(params.projectId),
    user_group_id: params.userGroupId,
    user_id: params.userIds,
  })
}

export const deleteMember: any = async (params: any) => {
  await http.delete<any>('deleteMember', {
    project_id: Number(params.projectId),
    user_id: params.userId,
  })
}

export const getProjectPermission: any = async (params: any) => {
  const response: any = await http.get<any>('getProjectPermission', {
    project_id: params.projectId,
  })
  return {
    list: response.data.map((i: any) => ({
      id: i.id,
      name: i.content_txt || i.name,
      type: i.type,
    })),
  }
}

export const addPermission: any = async (params: any) => {
  const response = await http.post<any>('addPermission', {
    name: params.name,
    project_id: params.projectId,
  })
  return response
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
  const response: any = await http.get<any>('getPermission', {
    role_id: params.roleId,
    project_id: params.projectId,
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

export const setPermission: any = async (params: any) => {
  await http.put<any>('setPermission', {
    role_id: params.roleId,
    permission_ids: params.permissionIds,
    project_id: params.projectId,
  })
}
