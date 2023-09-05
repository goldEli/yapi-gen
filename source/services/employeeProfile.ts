import urls from '@/constants/urls'
import * as http from '@/tools/http'

// 获取事务详情
export const getMemberOverviewList = async () => {
  const response = await http.get<any>('getMemberOverviewList')
  return response.data.list
}

// 获取统计数据
export const getMemberOverviewStatistics = async (params: any) => {
  const response = await http.get<any>('getMemberOverviewStatistics', {
    is_star: params.isStart ? 1 : 0,
    keyword: params.keyword,
    start_time: params.time[0] ?? null,
    end_time: params.time[1] ?? null,
  })
  return response.data
}

// 获取任务数据
export const getMemberOverviewStoryList = async (params: any) => {
  const response = await http.get<any>('getMemberOverviewStoryList', {
    is_star: params.isStart ? 1 : 0,
    keyword: params.keyword,
    start_time: params.time[0] ?? null,
    end_time: params.time[1] ?? null,
    status: params.status,
    user_ids: params.user_ids,
    size: params.size,
  })
  return response.data
}
