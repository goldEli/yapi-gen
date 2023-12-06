/* eslint-disable no-promise-executor-return */
import urls from '@/constants/urls'
import * as http from '@/tools/http'
import { resolve } from 'path'

// 获取事务详情
export const getMemberOverviewList = async () => {
  const response = await http.get<any>('getMemberOverviewList', { type: 1 })
  const newData = response.data.list
  for (const item of newData) {
    for (let user of item.member_list) {
      user.id = `${item.id}_${user.id}`
    }
  }
  return newData
}

// 获取统计数据
export const getMemberOverviewStatistics = async (params: any) => {
  const response = await http.get<any>('getMemberOverviewStatistics', {
    is_star: params.isStart ? 1 : 2,
    keyword: params.keyword ?? '',
    start_time: params.time[0] ?? null,
    end_time: params.time[1] ?? null,
    user_id: params.user_id,
  })
  return response.data
}

// 获取任务数据
export const getMemberOverviewStoryList = async (params: any) => {
  const users = params.user_ids
  const response = await http.post<any>('getMemberOverviewStoryList', {
    status: params.status,
    users: params.user_ids,
    start_time: params.time[0] ?? null,
    end_time: params.time[1] ?? null,
    keyword: params.keyword ?? '',
    is_star: params.isStart ? 1 : 2,
  })
  return response.data
}

// 获取更多任务数据
export const getMemberOverviewMoreStoryList = async (params: any) => {
  const response = await http.post<any>('getMemberOverviewMoreStoryList', {
    status: params.status,
    user_id: params.user_id,
    start_time: params.time[0] ?? null,
    end_time: params.time[1] ?? null,
    keyword: params.keyword ?? '',
    is_star: params.isStart ? 1 : 2,
    page: params.page,
    project_ids: params.project_ids,
  })
  return response.data.list
}

// 添加星标
export const followsMark = async (params: any) => {
  await http.post<any>('followsMark', {
    type: params.type,
    relation_id: params.relation_id,
  })
}

// 取消星标
export const followsCancel = async (params: any) => {
  await http.post<any>('followsCancel', {
    type: params.type,
    relation_id: params.relation_id,
  })
}

export const toggleStar = async (id: any, isStar: any) => {
  const promise = isStar
    ? followsMark({ type: 1, relation_id: id })
    : followsCancel({ type: 1, relation_id: id })
  await promise
  return new Promise(resolve => setTimeout(() => resolve(1), 1000))
}

// 获取汇报数据
export const getMemberOverviewReportList = async (params: any) => {
  const response = await http.post<any>('getMemberOverviewReportList', {
    user_ids: params.user_ids || [],
    start_time: params.time?.[0] ?? null,
    end_time: params.time?.[1] ?? null,
    is_star: params.isStart ? 1 : 2,
  })
  return response.data
}

// 获取更多任务数据
export const getMemberOverviewMoreReportList = async (params: any) => {
  const response = await http.get<any>('getMemberOverviewMoreReportList', {
    current_user_id: params.user_id,
    start_time: params.time[0] ?? null,
    end_time: params.time[1] ?? null,
    is_star: params.isStart ? 1 : 2,
    current_time: params.current_time,
  })
  return response.data
}

// 员工对比报告
export const getMemberOverviewCompare = async (params: any) => {
  const response = await http.post<any>('getMemberOverviewCompare', {
    users: params.user_ids,
    start_time: params.time[0] ?? null,
    end_time: params.time[1] ?? null,
  })
  return response.data
}
