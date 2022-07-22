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

  //   const response: any = await http.get<any>('getDemandInfo', {
  //     project_id: params.projectId,
  //     id: params.id,
  //   })
  const response: any = {}
  response.data = {
    id: 0,
    name: '敏捷',
    info: '描述',
    priority: {},
    expected_start_at: '2022-01-12',
    expected_end_at: '2022-12-01',
    finish_at: '2022-12-01',
    story_count: 21,
    iterate_name: '敏捷',
    user_name: '张三',
    child_story_count: 12,
    parent_name: '夫需求',
    attachment: [],
    tag: [],
    copysend: [],
    user: [],
  }
  return response.data
}

export const getDemandList: any = async (params: any) => {
  const response: any = await http.get<any>('getDemandList', {
    search: {
      project_id: params.projectId,
      keywaord: params.searchValue,
      iterate_id: params.iterateIds,
      status: params.statusIds,
      priority: params.priorityIds,
      user_id: params.userId,
      tag: params.tagIds,
      created_at: params.startTime,
      expected_start_at: params.expectedStart,
      expected_end_at: params.expectedEnd,
      updated_at: params.updatedTime,
      finish_at: params.endTime,
      users_name: params.usersNameId,
      users_copysend_name: params.copySendId,
      parent_id: params.parentId,
      all: params.all,
    },
    pagesize: params.pagesize,
    page: params.page,
    orderkey: params.orderkey,
    order: params.order,
  })

  response.data = {
    list: [
      {
        id: 0,
        name: '需求',
        priority: {},
        status: {},
        expected_start_at: '2022-2-12',
        expected_end_at: '2022-2-12',
        created_at: '2022-2-12',
        child_story_count: 12,
        iterate_name: '敏捷',
        users_name: '里斯',
      },
    ],
    pager: {
      total: 20,
      page: 2,
      pagesize: 12,
    },
  }

  return response.data
}

export const getDemandChangeLog: any = async (params: any) => {

  //   const response: any = await http.get<any>('getDemandChangeLog', {
  //     search: {
  //       story_id: params.demandId,
  //       project_id: params.projectId
  //     },
  //     pagesize: params.pagesize,
  //     page: params.page,
  //     orderkey: params.orderkey,
  //     order: params.order,
  //   })
  const response: any = {}
  response.data = {
    list: [
      {
        id: '1',
        start_at: '2022-01-12',
        end_at: '2011-12-12',
        story_count: 12,
        story_finish_count: 21,
        status: 1,
        name: '敏捷',
      },
      {
        id: '2',
        start_at: '2022-01-12',
        end_at: '2011-12-12',
        story_count: 12,
        story_finish_count: 21,
        status: 1,
        name: '敏捷',
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
      name: i.name,
      finishCount: i.story_finish_count,
      storyCount: i.story_count,
      createdTime: i.created_at,
      endTime: i.end_at,
    })),
  }
}

export const getCommentList: any = async (params: any) => {

  //   const response: any = await http.get<any>('getCommentList', {
  //     search: {
  //       story_id: params.demandId,
  //       project_id: params.projectId
  //     },
  //     pagesize: params.pagesize,
  //     page: params.page,
  //     orderkey: params.orderkey,
  //     order: params.order,
  //   })
  const response: any = {}
  response.data = {
    list: [
      {
        id: '1',
        created_at: '2022-01-12',
        content: '内容',
        avatar: '',
        name: '敏捷',
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
      name: i.name,
      content: i.content,
      avatar: i.avatar,
      createdTime: i.created_at,
    })),
  }
}

export const addComment: any = async (params: any) => {
  await http.post<any>('addComment', {
    project_id: params.projectId,
    story_id: params.storyId,
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
    project_id: params.projectId,
    name: params.name,
    info: params.info,
    expected_start_at: '',
    expected_end_at: '',
    iterate_id: '',
    parent_id: '',
    priority: '',
    users: params.userIds,
    copysend: params.copysendIds,
    tag: [],
    attachment: [],
  })
}

export const updateDemand: any = async (params: any) => {
  await http.put<any>('updateDemand', {
    project_id: params.projectId,
    name: params.name,
    info: params.info,
    expected_start_at: '',
    expected_end_at: '',
    iterate_id: '',
    parent_id: '',
    priority: '',
    users: params.userIds,
    copysend: params.copysendIds,
    tag: [],
    attachment: [],
  })
}

export const deleteDemand: any = async (params: any) => {
  await http.delete<any>('deleteDemand', {
    project_id: params.projectId,
    id: params.id,
  })
}

export const deleteInfoDemand: any = async (params: any) => {
  await http.put<any>('deleteInfoDemand', {
    project_id: params.projectId,
    id: params.demandId,
    target_id: params.targetId,
    type: params.type,
  })
}

export const updatePriority: any = async (params: any) => {
  await http.put<any>('updatePriority', {
    priority: params.priorityId,
    id: params.demandId,
  })
}
