/* eslint-disable @typescript-eslint/indent */
/* eslint-disable complexity */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '../tools/http'

export const getUserInfoAbeyanceStory: any = async (params: any) => {
  const response = await http.get('userInfoAbeyanceStory', {
    search: {
      project_id: params?.projectId,
      keyword: params?.keyword,
      category_status_ids: params.searchGroups?.statusId,
      priority: params.searchGroups?.priorityId,
      iterate_id: params.searchGroups?.iterateId,
      tag: params.searchGroups?.tagId,
      user_id: params.searchGroups?.userId,
      users_name: params.searchGroups?.usersnameId,
      users_copysend_name: params.searchGroups?.usersCopysendNameId,
      created_at: params.searchGroups?.createdAtId,
      expected_start_at: params.searchGroups?.expectedStartAtId,
      expected_end_at: params.searchGroups?.expectedendat,
      updated_at: params.searchGroups?.updatedat,
      finish_at: params.searchGroups?.finishAt,
      panel_date: params?.panelDate,
      all: params?.all,
      class_ids: params.searchGroups?.class_ids,
      category_id: params.searchGroups?.category_id,
      schedule_start: params.searchGroups?.schedule_start,
      schedule_end: params.searchGroups?.schedule_end,
      custom_field: params.searchGroups?.custom_field,
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
    target_id: params?.targetId,
  })
  if (params?.all) {
    return response.data?.list?.map((k: any) => ({
      status_name: k.status_name,
      count: k.count,
      list: k.list
        ? k.list?.map((i: any) => ({
            statusName: k.status_name,
            category_attachment: i.category_attachment,
            categoryConfigList: i.category_config_list,
            id: i.id,
            name: i.name,
            demand: i.child_story_count,
            priority: i.priority,
            iteration: i.iterate_name || '--',
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
            project_id: i.project_id,
            isExamine: i.verify_lock === 1,
            ...i.custom_field,
            usersNameIds: i.users_name_ids,
            usersCopySendIds: i.users_copysend_name_ids,
            copy_send_users: i.copy_send_users,
            category: i.category,
            categoryColor: i.category_color,
            class: i.class,
            storyPrefixKey: i.story_prefix_key,
            project: {
              isPublic: i.project.is_public,
              isUserMember: i.project.user_ismember,
              permissions: i.project.permissions,
              isEdit: Object.values(i.project.permissions).includes(
                i.project_type === 2
                  ? 'b/transaction/update'
                  : i.project_type === 1 && i.is_bug === 1
                  ? 'b/flaw/update'
                  : 'b/story/update',
              ),
              isDelete: Object.values(i.project.permissions).includes(
                i.project_type === 2
                  ? 'b/transaction/delete'
                  : i.project_type === 1 && i.is_bug === 1
                  ? 'b/flaw/delete'
                  : 'b/story/delete',
              ),
            },
            usersInfo: i.usersInfo,
            is_bug: i.is_bug,
            project_type: i.project_type,
          }))
        : [],
    }))
  } else {
    return {
      list: response.data?.list
        ? response.data.list.map((i: any) => ({
            category_attachment: i.category_attachment,
            categoryConfigList: i.category_config_list,
            id: i.id,
            name: i.name,
            demand: i.child_story_count,
            priority: i.priority,
            iteration: i.iterate_name || '--',
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
            project_id: i.project_id,
            isExamine: i.verify_lock === 1,
            ...i.custom_field,
            usersNameIds: i.users_name_ids,
            usersCopySendIds: i.users_copysend_name_ids,
            copy_send_users: i.copy_send_users,
            category: i.category,
            categoryColor: i.category_color,
            class: i.class,
            storyPrefixKey: i.story_prefix_key,
            project: {
              isPublic: i.project.is_public,
              isUserMember: i.project.user_ismember,
              permissions: i.project.permissions,
              isEdit: Object.values(i.project.permissions).includes(
                i.project_type === 2
                  ? 'b/transaction/update'
                  : i.project_type === 1 && i.is_bug === 1
                  ? 'b/flaw/update'
                  : 'b/story/update',
              ),
              isDelete: Object.values(i.project.permissions).includes(
                i.project_type === 2
                  ? 'b/transaction/delete'
                  : i.project_type === 1 && i.is_bug === 1
                  ? 'b/flaw/delete'
                  : 'b/story/delete',
              ),
            },
            usersInfo: i.usersInfo,
            is_bug: i.is_bug,
            project_type: i.project_type,
          }))
        : [],
      pager: response.data.pager,
    }
  }
}

export const getUserInfoCreateStory: any = async (params: any) => {
  const response = await http.get('userInfoCreateStory', {
    search: {
      project_id: params.projectId,
      keyword: params?.keyword,
      category_status_ids: params.searchGroups?.statusId,
      priority: params.searchGroups?.priorityId,
      iterate_id: params.searchGroups?.iterateId,
      tag: params.searchGroups?.tagId,
      user_id: params.searchGroups?.userId,
      users_name: params.searchGroups?.usersnameId,
      users_copysend_name: params.searchGroups?.usersCopysendNameId,
      created_at: params.searchGroups?.createdAtId,
      expected_start_at: params.searchGroups?.expectedStartAtId,
      expected_end_at: params.searchGroups?.expectedendat,
      updated_at: params.searchGroups?.updatedat,
      finish_at: params.searchGroups?.finishAt,
      class_ids: params.searchGroups?.class_ids,
      category_id: params.searchGroups?.category_id,
      schedule_start: params.searchGroups?.schedule_start,
      schedule_end: params.searchGroups?.schedule_end,
      custom_field: params.searchGroups?.custom_field,
    },
    target_id: params?.targetId,
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  return {
    list: response.data?.list
      ? response.data.list.map((i: any) => ({
          category_attachment: i.category_attachment,
          categoryConfigList: i.category_config_list,
          id: i.id,
          name: i.name,
          demand: i.child_story_count,
          priority: i.priority,
          iteration: i.iterate_name || '--',
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
          project_id: i.project_id,
          isExamine: i.verify_lock === 1,
          ...i.custom_field,
          usersNameIds: i.users_name_ids,
          usersCopySendIds: i.users_copysend_name_ids,
          copy_send_users: i.copy_send_users,
          category: i.category,
          categoryColor: i.category_color,
          class: i.class,
          storyPrefixKey: i.story_prefix_key,
          project: {
            isPublic: i.project.is_public,
            isUserMember: i.project.user_ismember,
            permissions: i.project.permissions,
            isEdit: Object.values(i.project.permissions).includes(
              i.project_type === 2
                ? 'b/transaction/update'
                : i.project_type === 1 && i.is_bug === 1
                ? 'b/flaw/update'
                : 'b/story/update',
            ),
            isDelete: Object.values(i.project.permissions).includes(
              i.project_type === 2
                ? 'b/transaction/delete'
                : i.project_type === 1 && i.is_bug === 1
                ? 'b/flaw/delete'
                : 'b/story/delete',
            ),
          },
          usersInfo: i.usersInfo,
          is_bug: i.is_bug,
          project_type: i.project_type,
        }))
      : [],
    pager: response.data.pager,
  }
}

export const getUserInfoFinishStory: any = async (params: any) => {
  const response = await http.get('userInfoFinishStory', {
    search: {
      project_id: params.projectId,
      keyword: params?.keyword,
      category_status_ids: params.searchGroups?.statusId,
      priority: params.searchGroups?.priorityId,
      iterate_id: params.searchGroups?.iterateId,
      tag: params.searchGroups?.tagId,
      user_id: params.searchGroups?.userId,
      users_name: params.searchGroups?.usersnameId,
      users_copysend_name: params.searchGroups?.usersCopysendNameId,
      created_at: params.searchGroups?.createdAtId,
      expected_start_at: params.searchGroups?.expectedStartAtId,
      expected_end_at: params.searchGroups?.expectedendat,
      updated_at: params.searchGroups?.updatedat,
      finish_at: params.searchGroups?.finishAt,
      class_ids: params.searchGroups?.class_ids,
      category_id: params.searchGroups?.category_id,
      schedule_start: params.searchGroups?.schedule_start,
      schedule_end: params.searchGroups?.schedule_end,
      custom_field: params.searchGroups?.custom_field,
    },
    target_id: params?.targetId,
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  return {
    list: response.data?.list
      ? response.data?.list?.map((i: any) => ({
          category_attachment: i.category_attachment,
          categoryConfigList: i.category_config_list,
          id: i.id,
          name: i.name,
          demand: i.child_story_count,
          priority: i.priority,
          iteration: i.iterate_name || '--',
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
          project_id: i.project_id,
          isExamine: i.verify_lock === 1,
          ...i.custom_field,
          usersNameIds: i.users_name_ids,
          usersCopySendIds: i.users_copysend_name_ids,
          copy_send_users: i.copy_send_users,
          category: i.category,
          categoryColor: i.category_color,
          class: i.class,
          storyPrefixKey: i.story_prefix_key,
          project: {
            isPublic: i.project.is_public,
            isUserMember: i.project.user_ismember,
            permissions: i.project.permissions,
            isEdit: Object.values(i.project.permissions).includes(
              i.project_type === 2
                ? 'b/transaction/update'
                : i.project_type === 1 && i.is_bug === 1
                ? 'b/flaw/update'
                : 'b/story/update',
            ),
            isDelete: Object.values(i.project.permissions).includes(
              i.project_type === 2
                ? 'b/transaction/delete'
                : i.project_type === 1 && i.is_bug === 1
                ? 'b/flaw/delete'
                : 'b/story/delete',
            ),
          },
          usersInfo: i.usersInfo,
          is_bug: i.is_bug,
          project_type: i.project_type,
        }))
      : [],
    pager: response.data.pager,
  }
}

export const getUserInfoProject: any = async (params: any) => {
  const response = await http.get('userInfoProject', {
    type: params.type,
    target_id: params.targetId,

    // abeyance-待办 ；copysend-抄送； create创建 ；finish-已办
  })
  return response
}

export const getUserInfoOverviewStatistics: any = async (params: any) => {
  const response = await http.get('userInfoOverviewStatistics', {
    target_id: params.targetId,
    project_id: params?.projectId,
  })

  return response.data
}

export const getUserInfoOverviewFeed: any = async (params: any) => {
  const response = await http.get('userInfoOverviewFeed', {
    limit: params.limit,
    page: params.page,
    pagesize: params.pagesize,
    target_id: params.targetId,
  })
  return response.data?.map((i: any) => ({
    id: i.id,
    createTime: i.created_at,
    content: i.content,
    projectName: i.feedable?.project?.name,
    name: i.feedable?.name,
    isPublic: i.feedable?.project?.is_public,
    isUserMember: i.feedable?.project?.user_ismember,
    deletedTime: i.feedable?.deleted_at,
    projectDeletedTime: i.feedable?.project?.deleted_at,
    feedableId: i.feedable_id,
    projectId: i.feedable?.project_id,
  }))
}

export const getMemberInfoAbeyanceStory: any = async (params: any) => {
  const response = await http.get('memberInfoAbeyanceStory', {
    search: {
      project_id: params?.projectId,
      keyword: params?.keyword,
      category_status_ids: params.searchGroups?.statusId,
      priority: params.searchGroups?.priorityId,
      iterate_id: params.searchGroups?.iterateId,
      tag: params.searchGroups?.tagId,
      user_id: params.searchGroups?.userId,
      users_name: params.searchGroups?.usersnameId,
      users_copysend_name: params.searchGroups?.usersCopysendNameId,
      created_at: params.searchGroups?.createdAtId,
      expected_start_at: params.searchGroups?.expectedStartAtId,
      expected_end_at: params.searchGroups?.expectedendat,
      updated_at: params.searchGroups?.updatedat,
      finish_at: params.searchGroups?.finishAt,
      panel_date: params?.panelDate,
      all: params?.all,
      class_ids: params.searchGroups?.class_ids,
      category_id: params.searchGroups?.category_id,
      schedule_start: params.searchGroups?.schedule_start,
      schedule_end: params.searchGroups?.schedule_end,
      custom_field: params.searchGroups?.custom_field,
    },
    target_id: params?.targetId,
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  if (params?.all) {
    return response.data?.list?.map((k: any) => ({
      status_name: k.status_name,
      count: k.count,
      list: k.list
        ? k.list?.map((i: any) => ({
            statusName: k.status_name,
            category_attachment: i.category_attachment,
            categoryConfigList: i.category_config_list,
            id: i.id,
            name: i.name,
            demand: i.child_story_count,
            priority: i.priority,
            iteration: i.iterate_name || '--',
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
            project_id: i.project_id,
            isExamine: i.verify_lock === 1,
            ...i.custom_field,
            usersNameIds: i.users_name_ids,
            usersCopySendIds: i.users_copysend_name_ids,
            copy_send_users: i.copy_send_users,
            category: i.category,
            categoryColor: i.category_color,
            class: i.class,
            storyPrefixKey: i.story_prefix_key,
            project: {
              isPublic: i.project.is_public,
              isUserMember: i.project.user_ismember,
              permissions: i.project.permissions,
              isEdit: Object.values(i.project.permissions).includes(
                i.project_type === 2
                  ? 'b/transaction/update'
                  : i.project_type === 1 && i.is_bug === 1
                  ? 'b/flaw/update'
                  : 'b/story/update',
              ),
              isDelete: Object.values(i.project.permissions).includes(
                i.project_type === 2
                  ? 'b/transaction/delete'
                  : i.project_type === 1 && i.is_bug === 1
                  ? 'b/flaw/delete'
                  : 'b/story/delete',
              ),
            },
            usersInfo: i.usersInfo,
            is_bug: i.is_bug,
            project_type: i.project_type,
          }))
        : [],
    }))
  } else {
    return {
      list: response.data?.list
        ? response.data.list.map((i: any) => ({
            category_attachment: i.category_attachment,
            categoryConfigList: i.category_config_list,
            id: i.id,
            name: i.name,
            demand: i.child_story_count,
            priority: i.priority,
            iteration: i.iterate_name || '--',
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
            project_id: i.project_id,
            isExamine: i.verify_lock === 1,
            ...i.custom_field,
            usersNameIds: i.users_name_ids,
            usersCopySendIds: i.users_copysend_name_ids,
            copy_send_users: i.copy_send_users,
            category: i.category,
            categoryColor: i.category_color,
            class: i.class,
            storyPrefixKey: i.story_prefix_key,
            project: {
              isPublic: i.project.is_public,
              isUserMember: i.project.user_ismember,
              permissions: i.project.permissions,
              isEdit: Object.values(i.project.permissions).includes(
                i.project_type === 2
                  ? 'b/transaction/update'
                  : i.project_type === 1 && i.is_bug === 1
                  ? 'b/flaw/update'
                  : 'b/story/update',
              ),
              isDelete: Object.values(i.project.permissions).includes(
                i.project_type === 2
                  ? 'b/transaction/delete'
                  : i.project_type === 1 && i.is_bug === 1
                  ? 'b/flaw/delete'
                  : 'b/story/delete',
              ),
            },
            usersInfo: i.usersInfo,
            is_bug: i.is_bug,
            project_type: i.project_type,
          }))
        : [],
      pager: response.data.pager,
    }
  }
}

export const getMemberInfoCreateStory: any = async (params: any) => {
  const response = await http.get('memberInfoCreateStory', {
    search: {
      project_id: params.projectId,
      keyword: params?.keyword,
      category_status_ids: params.searchGroups?.statusId,
      priority: params.searchGroups?.priorityId,
      iterate_id: params.searchGroups?.iterateId,
      tag: params.searchGroups?.tagId,
      user_id: params.searchGroups?.userId,
      users_name: params.searchGroups?.usersnameId,
      users_copysend_name: params.searchGroups?.usersCopysendNameId,
      created_at: params.searchGroups?.createdAtId,
      expected_start_at: params.searchGroups?.expectedStartAtId,
      expected_end_at: params.searchGroups?.expectedendat,
      updated_at: params.searchGroups?.updatedat,
      finish_at: params.searchGroups?.finishAt,
      class_ids: params.searchGroups?.class_ids,
      category_id: params.searchGroups?.category_id,
      schedule_start: params.searchGroups?.schedule_start,
      schedule_end: params.searchGroups?.schedule_end,
      custom_field: params.searchGroups?.custom_field,
    },
    target_id: params?.targetId,
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  return {
    list: response.data?.list
      ? response.data.list.map((i: any) => ({
          category_attachment: i.category_attachment,
          categoryConfigList: i.category_config_list,
          id: i.id,
          name: i.name,
          demand: i.child_story_count,
          priority: i.priority,
          iteration: i.iterate_name || '--',
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
          project_id: i.project_id,
          isExamine: i.verify_lock === 1,
          ...i.custom_field,
          usersNameIds: i.users_name_ids,
          usersCopySendIds: i.users_copysend_name_ids,
          copy_send_users: i.copy_send_users,
          category: i.category,
          categoryColor: i.category_color,
          class: i.class,
          storyPrefixKey: i.story_prefix_key,
          project: {
            isPublic: i.project.is_public,
            isUserMember: i.project.user_ismember,
            permissions: i.project.permissions,
            isEdit: Object.values(i.project.permissions).includes(
              i.project_type === 2
                ? 'b/transaction/update'
                : i.project_type === 1 && i.is_bug === 1
                ? 'b/flaw/update'
                : 'b/story/update',
            ),
            isDelete: Object.values(i.project.permissions).includes(
              i.project_type === 2
                ? 'b/transaction/delete'
                : i.project_type === 1 && i.is_bug === 1
                ? 'b/flaw/delete'
                : 'b/story/delete',
            ),
          },
          usersInfo: i.usersInfo,
          is_bug: i.is_bug,
          project_type: i.project_type,
        }))
      : [],
    pager: response.data.pager,
  }
}

export const getMemberInfoFinishStory: any = async (params: any) => {
  const response = await http.get('memberInfoFinishStory', {
    search: {
      project_id: params.projectId,
      keyword: params?.keyword,
      category_status_ids: params.searchGroups?.statusId,
      priority: params.searchGroups?.priorityId,
      iterate_id: params.searchGroups?.iterateId,
      tag: params.searchGroups?.tagId,
      user_id: params.searchGroups?.userId,
      users_name: params.searchGroups?.usersnameId,
      users_copysend_name: params.searchGroups?.usersCopysendNameId,
      created_at: params.searchGroups?.createdAtId,
      expected_start_at: params.searchGroups?.expectedStartAtId,
      expected_end_at: params.searchGroups?.expectedendat,
      updated_at: params.searchGroups?.updatedat,
      finish_at: params.searchGroups?.finishAt,
      class_ids: params.searchGroups?.class_ids,
      category_id: params.searchGroups?.category_id,
      schedule_start: params.searchGroups?.schedule_start,
      schedule_end: params.searchGroups?.schedule_end,
      custom_field: params.searchGroups?.custom_field,
    },
    target_id: params?.targetId,
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  return {
    list: response.data?.list
      ? response.data?.list?.map((i: any) => ({
          category_attachment: i.category_attachment,
          categoryConfigList: i.category_config_list,
          id: i.id,
          name: i.name,
          demand: i.child_story_count,
          priority: i.priority,
          iteration: i.iterate_name || '--',
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
          project_id: i.project_id,
          isExamine: i.verify_lock === 1,
          ...i.custom_field,
          usersNameIds: i.users_name_ids,
          usersCopySendIds: i.users_copysend_name_ids,
          copy_send_users: i.copy_send_users,
          category: i.category,
          categoryColor: i.category_color,
          class: i.class,
          storyPrefixKey: i.story_prefix_key,
          project: {
            isPublic: i.project.is_public,
            isUserMember: i.project.user_ismember,
            permissions: i.project.permissions,
            isEdit: Object.values(i.project.permissions).includes(
              i.project_type === 2
                ? 'b/transaction/update'
                : i.project_type === 1 && i.is_bug === 1
                ? 'b/flaw/update'
                : 'b/story/update',
            ),
            isDelete: Object.values(i.project.permissions).includes(
              i.project_type === 2
                ? 'b/transaction/delete'
                : i.project_type === 1 && i.is_bug === 1
                ? 'b/flaw/delete'
                : 'b/story/delete',
            ),
          },
          usersInfo: i.usersInfo,
          is_bug: i.is_bug,
          project_type: i.project_type,
        }))
      : [],
    pager: response.data.pager,
  }
}

export const getMemberInfoProject: any = async (params: any) => {
  const response = await http.get('memberInfoProject', {
    type: params.type,
    target_id: params.targetId,

    // abeyance-待办 ；copysend-抄送； create创建 ；finish-已办
  })
  return response
}

export const getMemberInfoOverviewStatistics: any = async (params: any) => {
  const response = await http.get('memberInfoOverviewStatistics', {
    target_id: params.targetId,
    project_id: params.projectId,
  })

  return response.data
}
export const getPUserInfoOverviewFeed: any = async (params: any) => {
  const response = await http.get('userInfoOverviewFeed2', {
    target_id: params.targetId,
    project_id: params.projectId,
  })

  return response.data?.map((i: any) => ({
    id: i.id,
    createTime: i.created_at,
    content: i.content,
    projectName: i.feedable?.project?.name,
    name: i.feedable?.name,
    isPublic: i.feedable?.project?.is_public,
    isUserMember: i.feedable?.project?.user_ismember,
    deletedTime: i.feedable?.deleted_at,
    projectDeletedTime: i.feedable?.project?.deleted_at,
    feedableId: i.feedable_id,
    projectId: i.feedable?.project_id,
  }))
}

export const getMainInfo: any = async (params: any) => {
  const response = await http.get(`/b/get_user/${params.userId}`)
  return {
    name: response.data.name,
    phone: response.data.account?.phone,
    avatar: response.data.avatar,
  }
}

// 获取甘特图
export const getMemberGantt: any = async (params: any) => {
  const response = await http.get('getMemberGantt', {
    start_time: params.startTime,
    end_time: params.endTime,
    page: params.page,
    pagesize: params.pagesize,
    target_id: params.targetId,
    project_id: params.projectId,
  })

  return {
    pager: response.data.pager,
    list: response.data.list?.map((k: any, index: any) => ({
      ...k,
      id: k.id || new Date().getTime() + index * 11,
      text: k.name || '',
      start_date: k.start_at,
      end_date: k.end_at,
      statusName: k.status_name || '',
      statusColor: k.status_color || '',
      categoryName: k.category || '',
      categoryColor: k.category_color || '',
      parent: k.parent || '',
      render: k.render || '',
    })),
  }
}

// 获取甘特图
export const getUserGantt: any = async (params: any) => {
  const response = await http.get('getUserGantt', {
    start_time: params.startTime,
    end_time: params.endTime,
    page: params.page,
    pagesize: params.pagesize,
    target_id: params.targetId,
  })

  return {
    pager: response.data.pager,
    list: response.data.list?.map((k: any, index: any) => ({
      ...k,
      id: k.id || new Date().getTime() + index * 11,
      text: k.name || '',
      start_date: k.start_at,
      end_date: k.end_at,
      statusName: k.status_name || '',
      statusColor: k.status_color || '',
      categoryName: k.category || '',
      categoryColor: k.category_color || '',
      parent: k.parent || '',
      render: k.render || '',
    })),
  }
}
