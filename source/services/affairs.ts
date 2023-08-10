/* eslint-disable max-lines */
/* eslint-disable no-undefined */
import urls from '@/constants/urls'
import { filterTreeData, transData } from '@/tools'
import * as http from '@/tools/http'

// 删除关联
export const deleteAffairsRelation = async (
  params: API.Affairs.DeleteRelation.Params,
) => {
  await http.delete<any>('deleteAffairsRelation', params)
}

// 删除事务
export const deleteAffairs = async (params: {
  projectId: number
  id: number
  isDeleteChild?: number
}) => {
  await http.post<any>('deleteAffairs', {
    project_id: params.projectId,
    id: params.id,
    is_delete_childs: params.isDeleteChild,
  })
}

// 处理事务列表数据
const getListItem = (array: any, params: API.Affairs.GetAffairsList.Params) => {
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
    userAvatar: i.user_avatar,
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
    usersInfo: i.usersInfo,
    is_bug: i.is_bug,
    project_type: i.project_type,
    discovery_version: i.discovery_version_name,
    discovery_version_id: i.discovery_version,
    severity: i.severity,
    solution: i.solution,
    copy_send_users: i.copy_send_users,
  }))
}

// 纯数组-事务列表
export const getAffairsSelectList = async (
  params: API.Affairs.GetAffairsList.Params,
) => {
  const response = await http.get<any, API.Affairs.GetAffairsList.SelectResult>(
    'getAffairsList',
    {
      search: {
        project_id: params?.projectId,
        keyword: params?.searchValue,
        iterate_id: params?.iterateIds,
        category_status_ids: params?.statusIds,
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
    copy_send_users: i.copy_send_users,
  }))
}

// 获取事务列表 -- list格式
export const getAffairsList = async (
  params: API.Affairs.GetAffairsList.Params,
) => {
  const response = await http.get<any, API.Affairs.GetAffairsList.Result>(
    'getAffairsList',
    {
      search: {
        discovery_version: params?.discovery_version,
        severity: params?.severity,
        solution: params?.solution,
        project_id: params?.projectId,
        keyword: params?.searchValue,
        iterate_id: params?.iterateIds,
        category_status_ids: params?.statusIds,
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
  }
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
      userAvatar: i.user_avatar,
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
      usersInfo: i.usersInfo,
      is_bug: i.is_bug,
      project_type: i.project_type,
      discovery_version: i.discovery_version_name,
      discovery_version_id: i.discovery_version,
      severity: i.severity,
      solution: i.solution,
      copy_send_users: i.copy_send_users,
    })),
  }
}

// 获取子项事务
export const getChildAffairsList = async (params: any) => {
  const response = await http.get('getAffairsList', {
    search: {
      discovery_version: params?.discovery_version,
      severity: params?.severity,
      solution: params?.solution,
      project_id: params?.projectId,
      keyword: params?.searchValue,
      iterate_id: params?.iterateIds,
      category_status_ids: params?.statusIds,
      priority: params?.priorityIds,
      user_name: params?.userId,
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
  })

  if (params?.isChildren) {
    return {
      list: getListItem(response.data, params),
    }
  }
  return {
    currentPage: params.page,
    pageSize: params.pageSize,
    total: response.data.pager?.total,
    list: response.data?.map((i: any) => ({
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
      userAvatar: i.user_avatar,
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
      usersInfo: i.usersInfo,
      is_bug: i.is_bug,
      project_type: i.project_type,
      discovery_version: i.discovery_version_name,
      discovery_version_id: i.discovery_version,
      severity: i.severity,
      solution: i.solution,
      copy_send_users: i.copy_send_users,
    })),
  }
}
// 获取事务详情
export const getAffairsInfo = async (
  params: API.Affairs.GetAffairsInfo.Params,
) => {
  const response = await http.get<any, API.Affairs.GetAffairsInfo.Result>(
    'getAffairsInfo',
    {
      project_id: params.projectId,
      id: params.sprintId,
    },
  )

  return {
    category_attachment: response.data.category_attachment,
    id: response.data.id,
    name: response.data.name || '--',
    info: response.data.info.replaceAll('\n', '<br/>'),
    priority: response.data.priority,
    expectedStart: response.data.expected_start_at,
    expectedEnd: response.data.expected_end_at,
    finishTime: response.data.finish_at,
    demandCount: response.data.story_count,
    iterateName: response.data.iterate_name || '--',
    userName: response.data.user_name,
    childCount: response.data.child_story_count,
    parentName: response.data.parent_name,
    attachment: response.data.attachment,
    tag: response.data.tag,
    copySend: response.data.copysend,
    user: response.data.user || '--',
    createdTime: response.data.created_at,
    status: response.data.status,
    parentId: response.data.parent_id || null,
    changeCount: response.data.app_changelog_count,
    iterateId: response.data.iterate_id || null,
    projectId: response.data.project_id,
    isExamine: response.data.verify_lock === 1,
    customField: response.data.custom_field,
    schedule: response.data.schedule,
    category: response.data.category_id,
    class: response.data.class_id ? response.data.class_id : null,
    className: response.data.class,
    prefixKey: response.data.prefix_key,
    projectPrefix: response.data.project_prefix,
    hierarchy: response.data.hierarchy,
    level_tree: response.data.level_tree,
    categoryName: response.data.category,
    child_story_statistics: response.data.child_story_statistics,
    project_type: response.data.project_type,
    work_type: response.data.work_type,
    update_at: response.data.updated_at,
    category_status: response.data.category_status,
    severity: response.data.severity,
    solution: response.data.solution,
    discovery_version_name: response.data.discovery_version_name,
    discovery_version: response.data.discovery_version,
    iterate_info: response.data.iterate_info,
    has_verify: response.data.has_verify,
    verify_data: response.data.verify_data
      ? {
          cancel_verify: response.data.verify_data.cancel_verify,
          category_attachment: response.data.verify_data.category_attachment,
          categoryColor: response.data.verify_data.category_color,
          categoryName: response.data.verify_data?.category_name,
          statusFromTo: response.data.verify_data?.status_from_to,
          usersName: response.data.verify_data.users_name,
          userName: response.data.verify_data.user_name,
          time: response.data.verify_data.created_at,
          from: response.data.verify_data.category_status_from,
          to: response.data.verify_data.category_status_to,
          verifyStatus: response.data.verify_data.verify_status,
          verify: {
            verifyType: response.data.verify_data.verify.verify_type,
            process: response.data.verify_data.verify.process?.map(
              (i: any) => ({
                operator: i.operator,
                verifyUsers: i.verify_users?.map((k: any) => ({
                  id: k.user_id,
                  status: k.verify_status,
                  time: k.verify_at,
                  remark: k.verify_opinion,
                  userName: k.user_name,
                })),
              }),
            ),
          },
          fixedUser: response.data.verify_data.verify_users?.map((k: any) => ({
            userName: k.user_name,
            time: k.verify_at,
            status: k.verify_status,
            remark: k.verify_opinion,
            id: k.user_id,
          })),
          fields: response.data.verify_data.fields,
          id: response.data.verify_data.id,
        }
      : null,
    comment_total: response.data.comment_total,
    relation_stories: response.data.relation_stories,
  }
}

// 创建事务
export const addAffairs: any = async (params: any) => {
  const element = document.createElement('div')
  element.innerHTML = params?.info || ''
  const hasImg = Array.from(element.getElementsByTagName('img'))
  const info = hasImg.length
    ? params?.info
    : element.innerText
    ? params?.info
    : element.innerHTML

  await http.post<any>('addAffairs', {
    project_id: Number(params.projectId),
    name: params.name,
    info,
    expected_start_at: params?.expected_start_at,
    expected_end_at: params?.expected_end_at,
    iterate_id: params?.iterate_name || 0,
    parent_id: params?.parent_id || 0,
    priority: params?.priority?.id || 0,
    users: params?.users_name,
    copysend: params?.users_copysend_name,
    tag: params?.tagIds,
    attachment: params?.attachments,
    custom_field: params?.customField,
    category_id: params?.category_id,
    class_id: params?.class || 0,
    schedule: params?.schedule,
    status: params?.status,
    solution: params.solution,
    severity: params.severity || 0,
    discovery_version: params.discovery_version,
  })
}

// 编辑事务
export const updateAffairs: any = async (params: any) => {
  const element = document.createElement('div')
  element.innerHTML = params?.info || ''
  const hasImg = Array.from(element.getElementsByTagName('img'))
  const info = hasImg.length
    ? params?.info
    : element.innerText.trim() === ''
    ? params?.info
    : element.innerHTML
  await http.put<any>('updateAffairs', {
    project_id: params.projectId,
    name: params.name,
    info,
    expected_start_at: params.expected_start_at,
    expected_end_at: params.expected_end_at,
    iterate_id:
      JSON.stringify(params.iterateId) !== '[]' && params.iterate_name
        ? params.iterate_name
        : 0,
    parent_id:
      JSON.stringify(params.parentId) !== '[]' && params.parent_id
        ? params.parent_id
        : 0,
    priority:
      JSON.stringify(params.priority) !== '[]' && params.priority
        ? params.priority?.id
        : 0,
    users: params?.users_name,
    copysend: params?.users_copysend_name,
    tag: params.tagIds,
    attachment: params.attachments,
    id: params.id,
    custom_field: params?.customField,
    class_id: params?.class || 0,
    schedule: params?.schedule,
    solution: params.solution,
    severity: params.severity || 0,
    discovery_version: params.discovery_version,
  })
}

// 获取事务评论列表
export const getAffairsCommentList = async (
  params: API.Affairs.GetAffairsCommentList.Params,
) => {
  const response: any = await http.get<
    any,
    API.Affairs.GetAffairsCommentList.Result
  >('getAffairsCommentList', {
    search: {
      story_id: params.sprintId,
      project_id: params.projectId,
    },
    page: params.page,
    pagesize: params.pageSize,
  })

  return {
    list: response.data.list.map((i: any) => ({
      id: i.id,
      name: i.name,
      content: i.content,
      avatar: i.avatar,
      createdTime: i.created_at,
      statusContent: i.status_content,
      userId: i.user_id,
      attachment: i.app_attachment,
    })),
  }
}

// 添加评论
export const addAffairsComment = async (
  params: API.Affairs.AddAffairsComment.Params,
) => {
  await http.post<any>('addAffairsComment', {
    project_id: params.projectId,
    story_id: params.sprintId,
    content: params.content,
    attachment: params.attachment,
    a_user_ids: params.a_user_ids,
  })
}

// 删除评论
export const deleteAffairsComment = async (
  params: API.Affairs.DeleteAffairsComment.Params,
) => {
  await http.delete<any>('deleteAffairsComment', {
    project_id: params.projectId,
    id: params.id,
  })
}

// 编辑评论
export const updateAffairsComment = async (
  params: API.Affairs.UpdateAffairsComment.Params,
) => {
  await http.post<any>('updateAffairsComment', {
    project_id: params.projectId,
    story_id: params.storyId,
    content: params.content,
    a_user_ids: params.ids,
    id: params.id,
  })
}

// 事务变更记录
export const getAffairsChangeLog = async (
  params: API.Affairs.GetAffairsChangeLog.Params,
) => {
  const response = await http.get<any, API.Affairs.GetAffairsChangeLog.Result>(
    'getAffairsChangeLog',
    {
      search: {
        story_id: params.sprintId,
        project_id: params.projectId,
        change_user: params.change_user,
        change_keywords: params.change_keywords,
        created_at: params.created_at,
        change_type: params.change_type,
      },
      pagesize: params.pageSize,
      page: params.page,
      orderkey: params.orderKey,
      order: params.order,
    },
  )
  return {
    currentPage: params.page,
    total: response.data.pager?.total,
    list: response.data.list.map((i: any) => ({
      id: i.id,
      fields: i.fields,
      userName: i.user_name,
      updateTime: i.created_at,
      type: i.change_log_type,
      beforeField: JSON.stringify(i.before) === '[]' ? {} : i.before,
      afterField: i.after,
    })),
  }
}

// 事务流转记录
export const getAffairsStatusLog = async (
  params: API.Affairs.GetAffairsStatusLog.Params,
) => {
  const response = await http.get<any>('getAffairsStatusLog', {
    search: {
      story_id: params.sprintId,
      project_id: params.projectId,
      all: params?.all ? 1 : 0,
    },
    order: 'asc',
    orderkey: 'id',
  })
  return response.data?.map((i: any) => ({
    operationName: i.user_name,
    time: i.created_at,
    id: i.id,
    is_end: i.is_end,
    is_start: i.is_end,
    statusTo: i.statusto
      ? {
          color: i.statusto?.color,
          name: i.statusto?.content,
        }
      : null,
    changeType: i.change_type,
    fields: i.fields,
    verifyAll: {
      id: i.verify?.id,
      statusFrom: i.verify?.statusfrom
        ? {
            color: i.verify?.statusfrom?.color,
            name: i.verify?.statusfrom?.content,
          }
        : null,

      // 整条审核的状态  1-待审核  2-已通过 3-未通过
      verifyStatus: i.verify?.verify_status,
      verify: {
        // 1：固定审核流程；2：用户指定审核人
        verifyType: i.verify?.verify?.verify_type,
        fixedUser: {
          comment: i.verify?.verify?.fixedUser?.verify_opinion,
          verifyStatus: i.verify?.verify?.fixedUser?.verify_status,
          userName: i.verify?.verify?.fixedUser?.user_name,
        },
        process: i.verify?.verify?.process?.map((k: any) => ({
          operator: k.operator,
          verifyUsers: k.verify_users?.map((j: any) => ({
            id: j.id,
            name: j.name,
            verifyStatus: j.verify_status,
            verifyOpinion: j.verify_opinion,
            time: j.verify_at,
          })),
        })),
      },
    },
  }))
}

// 添加事务详情关联
export const addInfoAffairs = async (
  params: API.Affairs.AddInfoAffairs.Params,
) => {
  await http.put<any>('addInfoAffairs', {
    project_id: Number(params.projectId),
    id: Number(params.sprintId),
    target: params.targetId,
    type: params.type,
  })
}

// 删除事务详情关联
export const deleteInfoAffairs = async (
  params: API.Affairs.AddInfoAffairs.Params,
) => {
  await http.put<any>('deleteInfoAffairs', {
    project_id: Number(params.projectId),
    id: Number(params.sprintId),
    target_id: params.targetId,
    type: params.type,
  })
}

// 更新事务详情关联
export const updateInfoAffairs = async (
  params: API.Affairs.AddInfoAffairs.Params,
) => {
  await http.put<any>('updateAffairs', {
    project_id: Number(params.projectId),
    id: Number(params.sprintId),
    type: params.type,
    parent_id: params.parentId,
    name: params.name,
  })
}
// 快捷修改参数
export const updateAffairsTableParams = async (params: any) => {
  const response: any = await http.put<any>('changeAffairsTableParams', {
    project_id: params.projectId,
    id: params.id,
    ...params.otherParams,
  })
  return response
}

// 修改优先级
export const updateAffairsPriority = async (
  params: API.Affairs.UpdateAffairsPriority.Params,
) => {
  await http.put<any>('updateAffairsPriority', {
    priority: params.priorityId,
    id: params.id,
    project_id: params.projectId,
  })
}

// 修改事务类型
export const updateAffairsCategory = async (
  params: API.Affairs.UpdateAffairsCategory.Params,
) => {
  await http.put<any>('updateAffairsCategory', {
    project_id: params.projectId,
    story_id: params.id,
    category_id: params.categoryId,
    status_id: params.statusId,
  })
}

// 修改事务状态
export const updateAffairsStatus = async (
  params: API.Affairs.UpdateAffairsStatus.Params,
) => {
  delete params.fields.reviewerValue
  const response = await http.put<any>('updateAffairsStatus', {
    project_id: params.projectId,
    story_id: params.nId,
    category_status_to_id: params.toId,
    fields: params.fields,
    verify_user_id: params.verifyId ?? undefined,
  })
  return response
}

export const getLoadAffairsListFields = async (
  params: API.Affairs.GetLoadAffairsListFields.Params,
) => {
  const response: any = await http.get<
    any,
    API.Affairs.GetLoadAffairsListFields.Result
  >('getLoadAffairsListFields', {
    project_id: params.projectId,
    is_update: params.isUpdate,
    is_bug: params.isBug,
  })

  return {
    baseFields: response.data.base_fields,
    timeAndPersonFields: response.data.time_person_fields,
    customFields: response.data.custom_fields,
  }
}

// 导出事务字段列表
export const getExportAffairsFields = async (params: { projectId: number }) => {
  const response: any = await http.get<
    any,
    API.Affairs.GetLoadAffairsListFields.Result
  >('getExportAffairsFields', {
    project_id: params.projectId,
  })

  return {
    baseFields: response.data.base_fields,
    timeAndPersonFields: response.data.time_person_fields,
    customFields: response.data.custom_fields,
  }
}

// 获取下载模板
export const getImportDownloadAffairsModel = async (
  params: API.Affairs.GetImportDownloadAffairsModel.Params,
) => {
  const response = await http.get(
    'getImportDownloadAffairsModel',
    {
      is_update: params.isUpdate,
      project_id: params.projectId,
      fields: params.fields,
    },
    { responseType: 'blob' },
  )

  return response
}

// 导入事务
export const getImportAffairsExcel = async (
  params: API.Affairs.GetAffairsExcel.Params,
) => {
  const formData = new FormData()
  formData.append('project_id', String(params.projectId))
  formData.append('file_path', params.filePath)
  const response = await http.post('getImportAffairsExcel', formData, {
    headers: {
      'Content-Type': undefined,
    },
  })

  return {
    successCount: response.data.count || 0,
    errorCount: response.data.error_list
      ? Object.keys(response.data.error_list)?.length
      : 0,
    errorList: response.data.error_list ? response.data.error_list : {},
  }
}

// 导入更新
export const getImportAffairsExcelUpdate = async (
  params: API.Affairs.GetAffairsExcel.Params,
) => {
  const formData = new FormData()
  formData.append('project_id', String(params.projectId))
  formData.append('file_path', params.filePath)
  const response = await http.post('getImportAffairsExcelUpdate', formData, {
    headers: {
      'Content-Type': undefined,
    },
  })

  return {
    successCount: response.data.count || 0,
    errorCount: response.data.error_list
      ? Object.keys(response.data.error_list)?.length
      : 0,
    errorList: response.data.error_list ? response.data.error_list : {},
  }
}

// 导出事务
export const getExportAffairsExcel = async (params: any) => {
  const response = await http.post(
    'getExportAffairsExcel',
    {
      search: {
        project_id: params?.projectId,
        keyword: params?.searchValue,
        iterate_id: params?.iterateId,
        status: params?.statusId,
        priority: params?.priorityId,
        user_id: params?.userId,
        tag: params?.tagId,
        created_at: params?.createdAtId,
        expected_start_at: params?.expectedStartAtId,
        expected_end_at: params?.expectedendat,
        updated_at: params?.updatedat,
        finish_at: params?.finishAt,
        users_name: params?.usersnameId,
        users_copysend_name: params?.usersCopysendNameId,
        all: params?.all ? 1 : 0,
        panel: params?.panel ? 1 : 0,
        class_ids: params.class_ids,
        class_id: params.class_id,
        category_id: params.category_id,
        schedule_start: params.schedule_start,
        schedule_end: params.schedule_end,
        custom_field: params?.custom_field,
      },
      pagesize: params?.pageSize,
      page: params?.page,
      orderkey: params?.orderKey,
      order: params?.order,
      fields: params.fields,
    },
    { responseType: 'blob' },
  )
  return response
}

// 获取批量编辑的配置属性
export const getAffairsBatchEditConfig = async (
  params: API.Affairs.GetAffairsBatchEditConfig.Params,
) => {
  const response: any = await http.get<
    any,
    API.Affairs.GetAffairsBatchEditConfig.Result
  >('getBatchEditAffairsConfig', {
    project_id: params.projectId,
    story_ids: params.demandIds,
  })

  return response.data?.map((i: any) => ({
    label: i.title,
    value: i.content,
    selectList: i.values || [],
    attr: i.attr,
  }))
}

// 事务批量删除
export const batchAffairsDelete = async (
  params: API.Affairs.BatchAffairsDelete.Params,
) => {
  await http.delete<any>('batchAffairsDelete', {
    project_id: params.projectId,
    story_ids: params.demandIds,
    is_delete_childs: params.isDeleteChild,
  })
}

// 事务批量编辑
export const batchAffairsEdit = async (
  params: API.Affairs.BatchAffairsEdit.Params,
) => {
  await http.put<any>('batchAffairsEdit', {
    project_id: params.projectId,
    story_ids: params.demandIds,
    type: params.type,
    target: params.target,
  })
}

// 获取子事务列表
export const getAffairsChildList = async (
  params: API.Affairs.GetAffairsChildList.Params,
) => {
  const response = await http.get<any, API.Affairs.GetAffairsChildList.Result>(
    'getAffairsChildList',
    {
      project_id: params.projectId,
      id: params.id,
      keywords: params.searchValue,
      page: params.page,
      pagesize: params.pagesize,
    },
  )

  return {
    currentPage: response.data.pager?.page,
    pageSize: response.data.pager?.pagesize,
    total: response.data.pager?.total,
    list: response.data.list,
  }
}

//  下拉添加子事务
export const addAffairsChild = async (
  params: API.Affairs.AddAffairsChild.Params,
) => {
  await http.post<any>('addAffairsChild', {
    project_id: params.projectId,
    id: params.id,
    child_id: params.childId,
  })
}

// 子事务拖拽排序
export const affairsChildDragSort = async (
  params: API.Affairs.AffairsChildDragSort.Params,
) => {
  await http.post<any>('affairsChildDragSort', params)
}

// 搜索查询下拉子事务
export const getAffairsSelectChildren = async (
  params: API.Affairs.GetAffairsSelectChildren.Params,
) => {
  const response = await http.get<
    any,
    API.Affairs.GetAffairsSelectChildren.Result
  >('getAffairsSelectChildren', {
    project_id: params.projectId,
    id: params.id,
    keywords: params.keywords,
  })

  return response.data
}

// 最近子事务查询
export const getAffairsSelectChildrenRecent = async (
  params: API.Affairs.GetAffairsSelectChildrenRecent.Params,
) => {
  const response = await http.get<any>('getAffairsSelectChildrenRecent', {
    project_id: params.projectId,
    id: params.id,
  })
  return response.data
}

// 获取链接事务列表
export const getAffairsRelationStoriesList = async (
  params: API.Affairs.GetAffairsRelationList.Params,
) => {
  const response = await http.get<
    any,
    API.Affairs.GetAffairsRelationList.Result
  >('getAffairsRelationStoriesList', {
    project_id: params.projectId,
    id: params.id,
  })

  return {
    list: response.data,
  }
}

//  添加关联事务
export const addAffairsRelation = async (
  params: API.Affairs.AddAffairsRelation.Params,
) => {
  await http.post<any>('addAffairsRelation', {
    project_id: params.projectId,
    id: params.id,
    relation_id: params.relationId,
    type: params.type,
  })
}

// 关联事务拖拽排序
export const affairsRelationDragSort = async (
  params: API.Affairs.AffairsRelationDragSort.Params,
) => {
  await http.post<any>('affairsRelationDragSort', {
    project_id: params.projectId,
    id: params.id,
    relation_ids: params.relationIds,
    type: params.type,
  })
}

// 搜索查询下拉关联事务
export const getAffairsSelectRelationSearch = async (
  params: API.Affairs.GetAffairsRelationList.Params,
) => {
  const response = await http.get<
    any,
    API.Affairs.GetAffairsRelationList.Result
  >('getAffairsSelectRelationSearch', {
    project_id: params.projectId,
    id: params.id,
    keywords: params.searchValue,
  })

  return response.data
}

// 最近子事务查询
export const getAffairsSelectRelationRecent = async (
  params: API.Affairs.GetAffairsRelationList.Params,
) => {
  const response = await http.get<
    any,
    API.Affairs.GetAffairsRelationList.Result
  >('getAffairsSelectRelationRecent', {
    project_id: params.projectId,
    id: params.id,
  })
  return response.data
}

// 创建子事务-快捷
export const addQuickAffairs = async (
  params: API.Affairs.AddQuickAffair.Params,
) => {
  await http.post<any>('addAffairs', {
    project_id: Number(params.projectId),
    name: params.name,
    category_id: params?.category_id,
    parent_id: params?.parent_id || 0,
  })
}

// 编辑富文本
export const updateEditor = async (params: API.Affairs.UpdateEditor.Params) => {
  await http.put<any>('updateAffairs', {
    project_id: params.projectId,
    info: params.info,
    id: params.id,
    name: params.name,
  })
}

// 获取可流转的
export const getShapeAffairsLeft = async (params: any) => {
  const res = await http.get('getShapeAffairsLeft', {
    project_id: params.id,
    story_id: params.nId,
  })

  return res.data
}

// 可流转状态配置
export const getShapeAffairsRight = async (params: any) => {
  const res = await http.get('getShapeAffairsRight', {
    project_id: params.id,
    story_id: params.nId,
    category_status_from_id: params.fromId,
    category_status_to_id: params.toId,
  })

  const selectData = res.data.fieldsFilterData
  // 公司
  const filterCompanyList = selectData.company_user

  // 处理人、抄送人

  const filterMemberList = selectData.project_member

  // 分类

  const treeData = [
    {
      name: '全部分类',
      key: 0,
      id: 0,
      pid: 1,
      parent_id: 0,
      story_count: res.data[0]?.story_count,
      children: [
        {
          key: -1,
          name: '未分类',
          pid: 0,
          id: -1,
          story_count: res.data[1]?.story_count,
        },
        ...(transData(
          selectData.class ? selectData.class : [],
          'id',
          'parent_id',
          'children',
        ) ?? []),
      ],
    },
  ]
  const filterTreeList = filterTreeData(treeData)

  // 迭代

  const filterIterateList = selectData.iterate_name

  // 标签

  const filterGetTagList = selectData.tag?.map((i: any) => ({
    id: i.id,
    name: i.content,
  }))

  // 优先级

  const filterGetPriOrStu = selectData.priority?.map((i: any) => ({
    id: i.id,
    name: i.content,
  }))

  const filterFieldsList = res.data.fields.map((item: any, index: number) => {
    if (item.title.includes('时间') && !item.attr) {
      return {
        ...item,
        id: index,
        name: item.title,
        key: item.content,
        content: item.content,
        type: 'time',
      }
    } else if (item.content.includes('users_name') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: [...filterMemberList],
        type: 'select_checkbox',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('users_copysend_name') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: [...filterCompanyList],
        type: 'select_checkbox',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('class') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: filterTreeList,
        type: 'tree',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('iterate_name') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: filterIterateList,
        type: 'select',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('tag') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: filterGetTagList,
        type: 'tag',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('priority') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: filterGetPriOrStu,
        type: 'select',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.title.includes('需求进度') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: item.values,
        type: 'number',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('comment') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: item.values,
        type: 'area',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.attr) {
      if (item.attr === 'date') {
        return {
          ...item,
          id: index,
          name: item.title,
          key: item.content,
          content: item.content,
          dvalue: item.true_value,
          type: item.value[0],
        }
      }

      // 这里操作人员

      if (item.attr === 'user_select') {
        if (item.value[0] === 'projectMember') {
          return {
            ...item,
            id: index,
            name: item.title,
            key: item.content,
            content: item.content,
            dvalue: item.true_value,
            type: 'select',
            children: [...filterMemberList],
          }
        }
        if (item.value[0] === 'companyMember') {
          return {
            ...item,
            id: index,
            name: item.title,
            key: item.content,
            content: item.content,
            dvalue: item.true_value,
            type: 'select',
            children: [...filterCompanyList],
          }
        }
      }
      if (item.attr === 'user_select_checkbox') {
        if (item.value[0] === 'projectMember') {
          return {
            ...item,
            id: index,
            name: item.title,
            key: item.content,
            content: item.content,
            dvalue: item.true_value,
            type: 'select_checkbox',
            children: [...filterMemberList],
          }
        }
        if (item.value[0] === 'companyMember') {
          return {
            ...item,
            id: index,
            name: item.title,
            key: item.content,
            content: item.content,
            dvalue: item.true_value,
            type: 'select_checkbox',
            children: [...filterCompanyList],
          }
        }
      }
      return {
        ...item,
        id: index,
        name: item.title,
        key: item.content,
        content: item.content,
        type: item.attr,
        dvalue: item.true_value,
        children: item?.value
          ? item?.value?.map((k: any) => ({
              name: k,
              id: k,
            }))
          : [],
      }
    }

    return {
      ...item,
      id: index,
      name: item.title,
      key: item.content,
      content: item.content,

      type: 'select',
    }
  })

  const obj = {
    fields: filterFieldsList,
    verify: res.data.verify,
    is_verify: res.data.is_verify === 1,
    user_has_auth: res.data.user_has_auth,
    originalStatusUserIds: res.data.originalStatusUserIds,
  }
  return obj
}
