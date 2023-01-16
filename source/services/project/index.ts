/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { getNestedChildren } from '@/tools'
import * as http from '@/tools/http'
import { getStaffList2 } from './../staff'

export const getProjectList: any = async (params: any) => {
  const response: any = await http.get<any>('getProjectList', {
    search: {
      self: params.self ? 1 : 0,
      keyword: params.searchValue,
      is_public: params?.isPublic ? Number(params.isPublic) : '',
      status: Number(params.status) || '',
      all: params.all ? 1 : 0,
      group: params?.groupId,
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
        groupIds: i.groups?.map((k: any) => k.id),
      })),
    }
  }

  return {
    currentPage: params.page,
    pageSize: params.pageSize,
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

  const plainOptions3 = response.data.storyConfig.display_fidlds
    .filter((item: { group_name: string }) => item.group_name === '自定义字段')
    .map((item: any) => {
      return {
        label: item.title,
        value: item.content,
        is_default_display: item.is_default_display,
        labelTxt: item.content_txt,
      }
    })

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

  const titleList3: any[] = []
  plainOptions3
    .filter((item: any) => item.is_default_display === 1)
    .forEach((item: { title: any; value: any }) => {
      titleList3.push(item.value)
    })

  let filterBasicsList: any = []
  let filterSpecialList: any = []
  let filterCustomList: any = []
  // 查所有项目时，不显示筛选
  if (params.projectId) {
    filterBasicsList = response.data.storyConfig?.filter_fidlds.filter(
      (item: any) => item.group_name === '基本字段',
    )

    filterSpecialList = response.data.storyConfig?.filter_fidlds.filter(
      (item: any) => item.group_name === '人员与时间字段',
    )

    filterCustomList = response.data.storyConfig?.filter_fidlds.filter(
      (item: any) => item.group_name === '自定义字段',
    )
  }

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
    plainOptions3,
    titleList,
    titleList2,
    titleList3,
    filterBasicsList,
    filterSpecialList,
    filterCustomList,
    filterFelid: response.data.storyConfig.filter_fidlds?.map((i: any) => ({
      type: ['user_select', 'user_select_checkbox'].includes(i.attr)
        ? 'select_checkbox'
        : i.attr,
      id: i.id,
      name: i.title,
      key: i.content,
      isDefault: i.is_default_filter,
      contentTxt: i.content_txt,
      content: i.content,
    })),
    projectPermissions: response.data.company_permissions,
    groupIds: response.data?.groups?.map((i: any) => i.id),
    isMember: response.data.user_ismember,
  }
}

export const addProject: any = async (params: any) => {
  await http.post<any>('addProject', {
    is_public: params?.isPublic,
    name: params.name,
    info: params?.info,
    cover: params?.cover,
    groups: params?.groupIds,
  })
}

export const updateProject: any = async (params: any) => {
  await http.put<any>('updateProject', {
    is_public: params.isPublic,
    name: params.name,
    info: params.info,
    cover: params.cover,
    id: params.id,
    groups: params?.groupIds,
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
      is_admin: i.is_admin,
    }))
  } else {
    return {
      currentPage: params.page,
      pageSize: params.pageSize,
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
      label: i.name,
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
  await http.delete<any>(`/b/project/role/${params.id}`, {
    project_id: params.projectId,
  })
}

export const updatePermission: any = async (params: any) => {
  await http.put<any>(`/b/project/role/${params.id}`, {
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

export const storyConfigField: any = async (params: any) => {
  const response: any = await http.get<any>('storyConfigField', {
    project_id: params.projectId,
    k: params?.key,
  })

  return {
    list: response.data.map((i: any) => ({
      name: i.title,
      hasDemand: i.use_custom_field_count,
      type: i.field_content,
      id: i.id,
      remarks: i.remarks,
      content: i.content,
    })),
  }
}

export const addStoryConfigField: any = async (params: any) => {
  const response = await http.post<any>('storyConfigField', {
    project_id: params.projectId,
    name: params.name,
    remarks: params.remarks,
    content: params.content,
  })
  return response
}

export const deleteStoryConfigField: any = async (params: any) => {
  await http.delete<any>(`/b/project/story_config/field/${params.id}`, {
    project_id: params.projectId,
  })
}

export const updateStoryConfigField: any = async (params: any) => {
  await http.put<any>(`/b/project/story_config/field/${params.id}`, {
    project_id: params.projectId,
    name: params.name,
    remarks: params.remarks,
    content: params.content,
    id: params.id,
  })
}

export const storyConfigCategoryList: any = async (params: any) => {
  const response: any = await http.get<any>('getCategoryList', {
    project_id: params.projectId,
    is_select: params.isSelect ? 1 : 2,
  })

  return {
    list: response.data.map((i: any) => ({
      name: i.name,
      hasDemand: i.story_count,
      color: i.color,
      id: i.id,
      isCheck: i.status,
      statusCount: i.status_count,
      remark: i.remark,
    })),
  }
}

export const changeCategoryStatus: any = async (params: any) => {
  await http.post<any>('changeCategoryStatus', {
    project_id: params.projectId,
    id: params.id,
    status: params.status,
  })
}

export const addStoryConfigCategory: any = async (params: any) => {
  await http.post<any>('addCategory', {
    name: params.name,
    color: params?.color,
    project_id: params.projectId,
    remark: params.remark,
  })
}

export const updateStoryConfigCategory: any = async (params: any) => {
  await http.post<any>('updateCategory', {
    name: params.name,
    color: params?.color,
    project_id: params.projectId,
    id: params.id,
    remark: params.remark,
  })
}

export const deleteStoryConfigCategory: any = async (params: any) => {
  await http.post<any>('deleteCategory', {
    project_id: params.projectId,
    id: params.id,
  })
}

export const changeStoryConfigCategory: any = async (params: any) => {
  await http.post<any>('moveCategoryStory', {
    status_id: params.statusId,
    old_category_id: params?.oldId,
    project_id: params.projectId,
    new_category_id: params.newId,
  })
}

export const storyConfigStatusList: any = async (params: any) => {
  const response: any = await http.get<any>('getStatusList', {
    search: {
      project_id: params.projectId,
      category_id: params.categoryId,
    },
    orderkey: params.orderKey,
    order: params.order,
  })

  return {
    list: response.data.map((i: any) => ({
      color: i.color,
      name: i.content,
      id: i.id,
      categoryName: i.category_name,
      isCheck: i.is_check,
      deleteData: i.deleteData,
    })),
  }
}

export const addStoryConfigStatus: any = async (params: any) => {
  const response = await http.post<any>('getStatusList', {
    project_id: params.projectId,
    content: params.name,
    color: params.color,
    category_id: params.categoryId,
  })
  return response
}

export const deleteStoryConfigStatus: any = async (params: any) => {
  await http.delete<any>(`/b/project/story_config/status/${params.id}`, {
    project_id: params.projectId,
    list: params.list,
  })
}

export const updateStoryConfigStatus: any = async (params: any) => {
  await http.put<any>(`/b/project/story_config/status/${params.id}`, {
    project_id: params.projectId,
    content: params.name,
    color: params.color,
  })
}

export const getWorkflowList: any = async (params: any) => {
  const response: any = await http.get<any>('getWorkflowList', {
    search: {
      project_id: params.projectId,
      category_id: params.categoryId,
    },
  })

  return {
    list: response.data.map((i: any) => ({
      id: i.id,
      index: i.id,
      info: i.info,
      categorys: i.categorys,
      startStatus: i.is_start === 1,
      endStatus: i.is_end === 1,
      color: i.status.color,
      name: i.status.content,
      deleteData: i.deleteData,
      sort: i.sort,
      statusId: i.status_id,
      canChange: i.can_changes_category_status,
    })),
  }
}

export const addStoryConfigWorkflow: any = async (params: any) => {
  await http.post<any>('getWorkflowList', {
    category_id: params.categoryId,
    ids: params?.ids,
    project_id: params.projectId,
  })
}

export const updateStoryConfigWorkflow: any = async (params: any) => {
  await http.put<any>(`/b/project/story_config/workflow/${params.id}`, {
    color: params.color,
    info: params?.info,
    project_id: params.projectId,
    content: params.name,
    is_end: params.endStatus,
    is_start: params?.startStatus,
  })
}

export const deleteStoryConfigWorkflow: any = async (params: any) => {
  await http.delete<any>(`/b/project/story_config/workflow/${params.id}`, {
    project_id: params.projectId,
    item: params.item,
  })
}

export const sortchangeWorkflow: any = async (params: any) => {
  await http.put<any>('dragWorkflow', {
    project_id: params.projectId,
    category_id: params.categoryId,
    list: params.ids,
  })
}

export const saveWorkflowStatus: any = async (params: any) => {
  await http.put<any>('saveWorkflowStatus', {
    project_id: params.projectId,
    category_id: params.categoryId,
    can_changes: params.canChanges,
  })
}

export const getWorkflowInfo: any = async (params: any) => {
  const response: any = await http.get<any>('getWorkflowInfo', {
    project_id: params.projectId,
    category_id: params.categoryId,
    category_status_from_id: params.fromId,
    category_status_to_id: params.toId,
  })

  const list: any = response.data.fieldAll?.map((i: any) => ({
    label: i.title,
    value: i.content,
    groupLabel: i.group_name,
    contentType: i.value ? JSON.parse(i.value) : null,
    defaultValueFields: {
      1: {
        type: 'select',
        options: i.field_type?.map((k: any) => ({
          label: k.title,
          value: k.content,
        })),
      },
      2: {
        type:
          i.fixed_type.attr === 'date' || i.fixed_type.attr === 'number'
            ? i.fixed_type.value ?? i.fixed_type.attr
            : i.fixed_type.attr,
        options:
          i.fixed_type.attr === 'date' ||
          i.fixed_type.attr === 'number' ||
          !i.fixed_type.value
            ? []
            : ['select', 'select_checkbox', 'radio', 'checkbox'].includes(
                i.fixed_type.attr,
              ) && String(i.content).includes('custom_')
            ? i.fixed_type.value?.map((fixed: any) => ({
                label: fixed,
                value: fixed,
              }))
            : i.fixed_type.value?.map((fixed: any) => ({
                label: fixed.content ?? fixed.name,
                value: fixed.id,
              })),
      },
    },
  }))

  response.data.fieldAll = list
  response.data.fields = response.data.fields?.map((k: any, index: any) => ({
    can_delete: k.can_delete,
    content: k.content,
    default_type: k.default_type,
    default_value: k.default_value,
    is_must: k.is_must,
    title: k.title,
    is_customize: k.is_customize,
    index: new Date().getTime() + index * 11,
    id: new Date().getTime() + index * 11,
  }))

  return response.data
}

export const saveWorkflowConfig: any = async (params: any) => {
  await http.post<any>('saveWorkflowConfig', {
    project_id: params.projectId,
    category_id: params.categoryId,
    category_status_from_id: params.fromId,
    category_status_to_id: params.toId,
    is_verify: params.isVerify,
    fields: params.fields,
    verify: {
      verify_type: params.verify_type,
      process: params.process,
    },
    auth: params.auth,
  })
}

// 获取分组列表
export const getGroupList: any = async () => {
  const response = await http.get<any>('getGroupList', {
    search: {
      all: 1,
    },
  })
  return {
    publicCount: response.data.public_count,
    selfCount: response.data.self_count,
    list: response.data?.list.map((i: any) => ({
      id: i.id,
      name: i.name,
    })),
  }
}

// 添加分组
export const addProjectGroup: any = async (params: any) => {
  await http.post<any>('addProjectGroup', {
    name: params.name,
  })
}

// 编辑分组
export const updateProjectGroup: any = async (params: any) => {
  await http.put<any>('updateProjectGroup', {
    name: params.name,
    id: params.id,
  })
}

// 删除分组
export const deleteProjectGroup: any = async (params: any) => {
  await http.delete<any>('deleteProjectGroup', {
    id: params.id,
  })
}

// 获取项目下拉数据
export const getProjectInfoValues: any = async (params: any) => {
  const response = await http.get<any>(`/b/project/getfilter_values`, {
    id: params.projectId,
  })

  let filterCompanyList: any = []
  let filterMemberList: any = []
  // 查所有项目时，不调用人员接口
  if (params.projectId) {
    // 公司
    const companyList = await getStaffList2({ all: 1 })
    filterCompanyList = companyList.map((item: any) => ({
      id: item.id,
      content: item.name,
      content_txt: item.name,
    }))

    const memberList = await http.get('getProjectMember', {
      search: {
        project_id: params.projectId,
        all: 1,
      },
    })
    filterMemberList = memberList.data.map((item: any) => {
      return {
        id: item.id,
        content: item.name,
        content_txt: item.name,
      }
    })
  }

  const getChildren = (key: any, values: any) => {
    let allValues: any = []
    let resultValues: any = []
    // 自定义数据并且不是人员数据
    if (
      key.includes('custom_') &&
      !['projectMember', 'companyMember'].includes(values[0])
    ) {
      resultValues = values?.map((i: any) => ({
        content_txt: i,
        content: i,
        id: i,
      }))
    } else if (
      key.includes('custom_') &&
      ['projectMember', 'companyMember'].includes(values[0])
    ) {
      // 自定义数据并且是人员数据
      resultValues =
        values[0] === 'projectMember' ? filterMemberList : filterCompanyList
    } else if (
      ['user_name', 'users_name', 'users_copysend_name'].includes(key)
    ) {
      // 抄送人、处理人及创建人下拉数据
      resultValues =
        key === 'users_copysend_name' ? filterCompanyList : filterMemberList
    } else {
      resultValues = values?.map((i: any) => ({
        content_txt: i.content_txt ?? i.name,
        content: i.content ?? i.name,
        id: i.id,
        status: i.status,
        color: i.color,
        icon: i.icon,
      }))
    }
    allValues = [{ id: -1, content: '空', content_txt: '空' }, ...resultValues]
    return allValues
  }

  return Object.keys(response.data)?.map((i: any) => ({
    children:
      i === 'class'
        ? [
            ...[
              {
                title: '未分类',
                key: 0,
                value: 0,
                children: [],
              },
            ],
            ...getNestedChildren(response.data[i], 0),
          ]
        : getChildren(i, response.data[i]),
    key: i,
    customTag: i.includes('custom_') ? response.data[i] : null,
  }))
}
