/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '@/tools/http'
import moment from 'moment'

export const getIterateList: any = async (params: any) => {
  const response: any = await http.get<any>('getIterateList', {
    search: {
      project_id: params.projectId,
      name: params.name,
      created_at: params.startTime,
      end_at: params.endTime,
      status: params.status,
      all: true,
    },
    orderkey: params.orderKey,
    order: params.order,
  })
  return {
    list: response.data.map((i: any) => ({
      id: i.id,
      status: i.status,
      name: i.name,
      finishCount: i.story_finish_count,
      storyCount: i.story_count,
      createdTime: i.created_at,
      endTime: i.end_at,
      info: i.info,
    })),
  }
}

export const addIterate: any = async (params: any) => {
  await http.post<any>('addIterate', {
    name: params.name,
    info: params.info,
    start_at: moment(params.time[0]).format('YYYY-MM-DD'),
    end_at: moment(params.time[1]).format('YYYY-MM-DD'),
    project_id: params.projectId,
  })
}

export const updateIterate: any = async (params: any) => {
  await http.patch<any>('editIterate', {
    name: params.name,
    info: params.info,
    project_id: params.projectId,
    id: params.id,
    start_at: moment(params.time[0]).format('YYYY-MM-DD'),
    end_at: moment(params.time[1]).format('YYYY-MM-DD'),
  })
}

export const deleteIterate: any = async (params: any) => {
  await http.delete<any>('deleteIterate', {
    project_id: params.projectId,
    id: params.id,
  })
}

export const getIterateInfo: any = async (params: any) => {

  //   const response: any = await http.get<any>('getIterateInfo', {
  //     project_id: params.projectId,
  //     id: params.id,
  //   })
  const response: any = {}
  response.data = {
    id: 0,
    name: '敏捷',
    info: '描述',
    start_at: '2022-01-12',
    end_at: '2022-12-01',
    story_count: 12,
    story_finish_count: 21,
    status: 2,
  }
  return response.data
}

export const getIterateChangeLog: any = async (params: any) => {

  //   const response: any = await http.get<any>('getIterateChangeLog', {
  //     search: {
  //       app_id: params.iterateId,
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

export const updateIterateStatus: any = async (params: any) => {
  await http.put<any>('updateIterateStatus', {
    project_id: params.projectId,
    id: params.id,
    status: params.status,
  })
}
