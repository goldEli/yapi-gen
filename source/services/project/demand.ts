/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '@/tools/http'

export const updateDemandStatus: any = async (params: any) => {
  await http.put<any>('updateDemandStatus', {
    project_id: params.projectId,
    story_id: params.demandId,
    status_id: params.statusId,
    content: params.content,
    user_ids: params.userIds,
  })
}

export const getDemandInfo: any = async (params: any) => {
  const response: any = await http.get<any>('getDemandInfo', {
    project_id: params.projectId,
    id: params.id,
  })
  return {
    id: response.data.id,
    name: response.data.name,
    info: response.data.info,
    priority: response.data.priority,
    expectedStart: response.data.expected_start_at,
    expectedEnd: response.data.expected_end_at,
    finishTime: response.data.finish_at,
    demandCount: response.data.story_count,
    iterateName: response.data.iterate_name,
    userName: response.data.user_name,
    childCount: response.data.child_story_count,
    parentName: response.data.parent_name,
    attachment: response.data.attachment,
    tag: response.data.tag,
    copySend: response.data.copysend,
    user: response.data.user,
    createdTime: response.data.created_at,
    status: response.data.status,
    parentId: response.data.parent_id,
  }
}

export const getDemandList: any = async (params: any) => {
  const response: any = await http.get<any>('getDemandList', {
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
      all: params?.all,
      panel: params?.panel,
    },
    pagesize: params?.pageSize,
    page: params?.page,
    orderkey: params?.orderKey,
    order: params?.order,
  })

  if (params.all && params.panel) {
    return response.data.map((k: any) => ({
      count: k.count,
      list: k.list.map((i: any) => ({
        childCount: i.child_story_count,
        id: i.id,
        name: i.name,
        userName: i.user_name.split(',') || [],
        priority: i.priority,
        status: i.status,
        info: i.info,
        userIds: i.user_id,
        iterateId: i.iterate_id,
        parentId: i.parent_id,
      })),
      name: k.status_name,
    }))
  } else if (params.all) {
    return response.data.map((i: any) => ({
      id: i.id,
      name: i.name,
      demand: i.child_story_count,
      priority: i.priority,
      iteration: i.iterate_name,
      status: i.status,
      dealName: i.users_name,
      time: i.created_at,
      expectedStart: i.expected_start_at,
      expectedEnd: i.expected_end_at,
      info: i.info,
      userIds: i.user_id,
      iterateId: i.iterate_id,
      parentId: i.parent_id,
    }))
  } else {
    return {
      currentPage: params.page,
      total: response.data.pager.total,
      list: response.data.list.map((i: any) => ({
        id: i.id,
        name: i.name,
        demand: i.child_story_count,
        priority: i.priority,
        iteration: i.iterate_name,
        status: i.status,
        dealName: i.users_name,
        time: i.created_at,
        expectedStart: i.expected_start_at,
        expectedEnd: i.expected_end_at,
        info: i.info,
        userIds: i.user_id,
        iterateId: i.iterate_id,
        parentId: i.parent_id,
      })),
    }
  }
}

export const getDemandChangeLog: any = async (params: any) => {
  const response: any = await http.get<any>('getDemandChangeLog', {
    search: {
      story_id: params.demandId,
      project_id: params.projectId,
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
      fields: i.fields,
      userName: i.user_id,
      updateTime: i.created_at,
      type: i.change_log_type,
      beforeField: JSON.stringify(i.before) === '[]' ? {} : i.before,
      afterField: i.after,
    })),
  }
}

export const getCommentList: any = async (params: any) => {
  const response: any = await http.get<any>('getCommentList', {
    search: {
      story_id: params.demandId,
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
    })),
  }
}

export const addComment: any = async (params: any) => {
  await http.post<any>('addComment', {
    project_id: params.projectId,
    story_id: params.demandId,
    content: params.content,
  })
}

export const deleteComment: any = async (params: any) => {
  await http.delete<any>('deleteComment', {
    project_id: params.projectId,
    id: params.id,
  })
}

export const addDemand: any = async (params: any) => {
  await http.post<any>('addDemand', {
    project_id: Number(params.projectId),
    name: params.name,
    info: params?.info,
    expected_start_at: params?.expectedStart,
    expected_end_at: params?.expectedEnd,
    iterate_id: params?.iterateId,
    parent_id: params?.parentId,
    priority: params?.priority,
    user: params?.userIds,
    copysend: params?.copySendIds,
    tag: params?.tagIds,
    attachment: params?.attachments,
  })
}

export const updateDemand: any = async (params: any) => {
  await http.put<any>('updateDemand', {
    project_id: params.projectId,
    name: params.name,
    info: params.info,
    expected_start_at: params.expectedStart,
    expected_end_at: params.expectedEnd,
    iterate_id: params.iterateId,
    parent_id: params.parentId,
    priority: params.priority,
    user: params.userIds,
    copysend: params.copySendIds,
    tag: params.tagIds,
    attachment: params.attachments,
    id: params.id,
  })
}

export const deleteDemand: any = async (params: any) => {
  await http.post<any>('deleteDemand', {
    project_id: params.projectId,
    id: params.id,
  })
}

export const deleteInfoDemand: any = async (params: any) => {
  await http.put<any>('deleteInfoDemand', {
    project_id: Number(params.projectId),
    id: Number(params.demandId),
    target_id: params.targetId,
    type: params.type,
  })
}

export const addInfoDemand: any = async (params: any) => {
  await http.put<any>('addInfoDemand', {
    project_id: Number(params.projectId),
    id: Number(params.demandId),
    target: params.targetId,
    type: params.type,
  })
}

export const updatePriority: any = async (params: any) => {
  await http.put<any>('updatePriority', {
    priority: params.priorityId,
    id: params.demandId,
  })
}
