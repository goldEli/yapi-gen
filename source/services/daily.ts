/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

// 日志

import * as http from '@/tools/http'

export const getProjectList: any = async () => {
  const response: any = await http.get<any>('getProjectList', {
    search: {
      self: 1,
      all: 1,
    },
    orderkey: 'name',
    order: 'asc',
  })

  const data = response?.data?.list?.map((item: any) => {
    return {
      id: item.id,
      title: item.name,
    }
  })
  return data
}

export const getDemandList: any = async (params: any) => {
  const response: any = await http.get<any>('getDemandList', {
    search: {
      project_id: params,
      all: 1,
    },
  })
  return response
}

export const getDailyList: any = async (params: any) => {
  const response: any = await http.get<any>('getDailyList', {
    search: {
      type: params.type,
      keyword: params.keyword,
      created_at: params.created_at,
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  const newList = response.data.list.map((item: any) => {
    return {
      key: item.id,
      name: item.name,
      finish_content: item.finish_content,
      file_count: item.file_count,
      story_count: item.story_count,
      created_at: item.created_at,
      copysend_user: item.copysend_user,
      read_user: item.read_user,
      ...item,
    }
  })
  const obj = {
    total: response.data.pager.total,
    list: newList,
  }
  return obj
}

// 创建和编辑日报
export const writeDaily: any = async (params: any, type: number) => {
  const obj = {
    finish_content: params.finish_content,
    plan_content: params.plan_content,
    copysend: params.copysend,
    files: params.files,
    story_ids: params.story_ids,
    type: params.type,
  }

  if (type === 2) {
    const response: any = await http.put<any>(
      `/b/report/update/${params.id}`,
      obj,
    )
    return response
  }

  const response: any = await http.post<any>('addDaily', obj)

  return response
}

// 获取报详情
export const getReportDetail: any = async (id: any) => {
  const response: any = await http.get<any>(`/b/report/info/${id}`)
  return response
}

export const getReceiveList: any = async (params: any) => {
  const response: any = await http.get<any>('getReceiveList', {
    search: {
      type: params.type,
      keyword: params.keyword,
      created_at: params.created_at,
      user_id: params.userId,
      // eslint-disable-next-line no-undefined
      status: params.status ? 2 : undefined,
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  const newList = response.data.list.map((item: any) => {
    return {
      key: item.id,
      name: item.name,
      finish_content: item.finish_content,
      file_count: item.file_count,
      story_count: item.story_count,
      created_at: item.created_at,
      copysend_user: item.copysend_user,
      read_user: item.read_user,
      ...item,
    }
  })
  const obj = {
    total: response.data.pager.total,
    list: newList,
  }
  return obj
}

// 评论
export const addComment: any = async (params: any) => {
  const response: any = await http.post<any>(
    `/b/report/comment/add/${params.id}`,
    {
      content: params.content,
    },
  )
  return response
}
