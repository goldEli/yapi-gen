/* eslint-disable no-promise-executor-return */
import urls from '@/constants/urls'
import * as http from '@/tools/http'
import { resolve } from 'path'

// 获取事务详情
export const getMemberOverviewList = async () => {
  const response = await http.get<any>('getMemberOverviewList')
  return response.data.list
}

// 获取统计数据
export const getMemberOverviewStatistics = async (params: any) => {
  const response = await http.get<any>('getMemberOverviewStatistics', {
    is_star: params.isStart ? 1 : null,
    keyword: params.keyword ?? '',
    start_time: params.time[0] ?? null,
    end_time: params.time[1] ?? null,
  })
  return response.data
}

// 获取任务数据
export const getMemberOverviewStoryList = async (params: any) => {
  const response = await http.get<any>('getMemberOverviewStoryList', {
    status: params.status,
    user_ids: params.user_ids.join(','),
    start_time: params.time[0] ?? null,
    end_time: params.time[1] ?? null,
    keyword: params.keyword ?? '',
    is_star: params.isStart ? 1 : null,
  })
  return response.data
}

// 获取更多任务数据
export const getMemberOverviewMoreStoryList = async (params: any) => {
  const response = await http.get<any>('getMemberOverviewMoreStoryList', {
    status: params.status,
    user_id: params.user_id,
    start_time: params.time[0] ?? null,
    end_time: params.time[1] ?? null,
    keyword: params.keyword ?? '',
    is_star: params.isStart ? 1 : null,
    page: params.page,
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
  isStar
    ? followsMark({ type: 1, relation_id: id })
    : followsCancel({ type: 1, relation_id: id })

  return new Promise(resolve => setTimeout(() => resolve(1), 1000))
}

// 获取任务数据
export const getMemberOverviewReportList = async (params: any) => {
  const response = await http.get<any>('getMemberOverviewReportList', {
    user_ids: params.user_ids.join(','),
    start_time: params.time[0] ?? null,
    end_time: params.time[1] ?? null,
    is_star: params.isStart ? 1 : null,
  })
  return response.data
}
