import urls from '@/constants/urls'
import * as http from '@/tools/http'

export const getSprintKanBanList = async (
  params: API.Sprint.GetSprintKanBanList.Params,
) => {
  const response = await http.get<any, API.Sprint.GetSprintKanBanList.Result>(
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
) => http.put<any, API.Sprint.GetProjectRoleList.Result>(`updateMember`, params)

// 处理事务列表数据
const getListItem = (array: any, params: API.Sprint.GetSprintList.Params) => {
  return array?.map((i: any) => ({
    id: i.id,
    name: i.name,
    demand: i.child_story_count,
    priority: i.priority,
    iteration: i.iterate_name,
    status: i.status,
    dealName: i.users_name || '--',
    time: i.created_at,
    expectedStart: i.expected_start_at,
    expectedEnd: i.expected_end_at,
    info: i.info,
    userIds: i.user_id,
    iterateId: i.iterate_id,
    parentId: i.parent_id,
    finishTime: i.finish_at,
    updatedTime: i.updated_at,
    usersCopySendName: i.users_copysend_name,
    userName: i.user_name,
    tag: i.tag,
    isExamine: i.verify_lock === 1,
    category: i.category,
    class: i.class,
    schedule: i.schedule,
    ...i.custom_field,
    categoryColor: i.category_color,
    categoryRemark: i.category_remark,
    category_attachment: i.category_attachment,
    categoryId: i.category_id,
    project_id: i.project_id,
    usersNameIds: i.users_name_ids,
    usersCopySendIds: i.users_copysend_name_ids,
    allChildrenCount: i.all_child_story_count,
    allChildrenIds: i.all_child_ids,
    children: getListItem(i.children, params) || null,
    level: i.level,
    isExpended: true,
    topId: params?.parentId ?? params?.topParentId,
    categoryConfigList: i.category_config_list,
    storyPrefixKey: i.story_prefix_key,
    work_type: i.work_type,
  }))
}

// 纯数组-事务列表
export const getSprintSelectList = async (
  params: API.Sprint.GetSprintList.Params,
) => {
  const response = await http.get<any, API.Sprint.GetSprintList.SelectResult>(
    'getSprintList',
    {
      search: {
        project_id: params?.projectId,
        keyword: params?.searchValue,
        iterate_id: params?.iterateIds,
        status: params?.statusIds,
        priority: params?.priorityIds,
        user_id: params?.userId,
        tag: params?.tagIds,
        created_at: params?.startTime,
        expected_start_at: params?.expectedStart,
        expected_end_at: params?.expectedEnd,
        updated_at: params?.updatedTime,
        finish_at: params?.endTime,
        users_name: params?.usersNameId,
        users_copysend_name: params?.copySendId,
        parent_id: params?.parentId,
        all: params?.all ? 1 : 0,
        panel: params?.panel ? 1 : 0,
        class_ids: params.class_ids,
        class_id: params.class_id,
        category_id: params.category_id,
        schedule_start: params.schedule_start,
        schedule_end: params.schedule_end,
        custom_field: params?.custom_field,
        tree: params?.tree || 0,
        top_parent_id: params?.topParentId,
        system_view: params?.system_view,
      },
      pagesize: params?.pageSize,
      page: params?.page,
      orderkey: params?.orderKey,
      order: params?.order,
    },
  )
  return response.data.map((i: any) => ({
    id: i.id,
    name: i.name,
    usersNameIds: i.users_name_ids,
    usersCopySendIds: i.users_copysend_name_ids,
    dealName: i.users_name?.split(';') || [],
    status: i.status,
    iteration: i.iterate_name,
    schedule: i.schedule,
    project_id: i.project_id,
    category: i.category,
    categoryColor: i.category_color,
    categoryRemark: i.category_remark,
    category_attachment: i.category_attachment,
    isExamine: i.verify_lock === 1,
    priority: i.priority,
    storyPrefixKey: i.story_prefix_key,
    categoryId: i.category_id,
  }))
}

// 获取事务列表 -- list格式
export const getSprintList = async (
  params: API.Sprint.GetSprintList.Params,
) => {
  const response = await http.get<any, API.Sprint.GetSprintList.Result>(
    'getSprintList',
    {
      search: {
        project_id: params?.projectId,
        keyword: params?.searchValue,
        iterate_id: params?.iterateIds,
        status: params?.statusIds,
        priority: params?.priorityIds,
        user_id: params?.userId,
        tag: params?.tagIds,
        created_at: params?.startTime,
        expected_start_at: params?.expectedStart,
        expected_end_at: params?.expectedEnd,
        updated_at: params?.updatedTime,
        finish_at: params?.endTime,
        users_name: params?.usersNameId,
        users_copysend_name: params?.copySendId,
        parent_id: params?.parentId,
        all: params?.all ? 1 : 0,
        panel: params?.panel ? 1 : 0,
        class_ids: params.class_ids,
        class_id: params.class_id,
        category_id: params.category_id,
        schedule_start: params.schedule_start,
        schedule_end: params.schedule_end,
        custom_field: params?.custom_field,
        tree: params?.tree || 0,
        top_parent_id: params?.topParentId,
        system_view: params?.system_view,
      },
      pagesize: params?.pageSize,
      page: params?.page,
      orderkey: params?.orderKey,
      order: params?.order,
    },
  )

  if (params?.isChildren) {
    return {
      list: getListItem(response.data, params),
    }
  } else {
    return {
      currentPage: params.page,
      pageSize: params.pageSize,
      total: response.data.pager?.total,
      list: response.data.list.map((i: any) => ({
        id: i.id,
        name: i.name,
        demand: i.child_story_count,
        priority: i.priority,
        iteration: i.iterate_name,
        status: i.status,
        dealName: i.users_name || '--',
        time: i.created_at,
        expectedStart: i.expected_start_at,
        expectedEnd: i.expected_end_at,
        info: i.info,
        userIds: i.user_id,
        iterateId: i.iterate_id,
        parentId: i.parent_id,
        finishTime: i.finish_at,
        updatedTime: i.updated_at,
        usersCopySendName: i.users_copysend_name,
        userName: i.user_name,
        tag: i.tag,
        isExamine: i.verify_lock === 1,
        category: i.category,
        class: i.class,
        schedule: i.schedule,
        ...i.custom_field,
        categoryColor: i.category_color,
        categoryRemark: i.category_remark,
        categoryId: i.category_id,
        project_id: i.project_id,
        usersNameIds: i.users_name_ids,
        usersCopySendIds: i.users_copysend_name_ids,
        category_attachment: i.category_attachment,
        allChildrenCount: i.all_child_story_count,
        allChildrenIds: i.all_child_ids,
        children: getListItem(i.children, params) || null,
        isExpended: params.topParentId === i.id,
        level: 1,
        topId: i.id,
        categoryConfigList: i.category_config_list,
        storyPrefixKey: i.story_prefix_key,
        work_type: i.work_type,
      })),
    }
  }
}

// 完成率Top10
export const getCompletionRate = async (
  params: API.Sprint.GetCompletionRate.Params,
) => {
  const response = await http.get<any, API.Sprint.GetCompletionRate.Result>(
    `getCompletionRate`,
    params,
  )
  return response.data
}
// 阶段缺陷占比
export const getDefectRatio = async (
  params: API.Sprint.GetDefectRatio.Params,
) => {
  const response = await http.get<any, API.Sprint.GetDefectRatio.Result>(
    `getDefectRatio`,
    params,
  )
  return response.data
}
// 缺陷趋势
export const getBugList = async (params: API.Sprint.GetDefectRatio.Params) => {
  const response = await http.get<any, API.Sprint.GetDefectRatio.Result>(
    `getDefectRatio`,
    params,
  )
  return response.data
}
