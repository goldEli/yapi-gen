/* eslint-disable no-promise-executor-return */
import urls from '@/constants/urls'
import * as http from '@/tools/http'

// 获取人员数据
export const getPerformanceInsightPersonList = async (params: any) => {
  const response = await http.get<any>('getPerformanceInsightPersonList', {
    status: params.status,
    user_ids: params.user_ids?.join(',') || [],
    start_time: params.time[0] ?? null,
    end_time: params.time[1] ?? null,
    keyword: params.keyword ?? '',
    is_star: params.isStart ? 1 : 2,
  })
  return response.data
}

// 获取看板列表数据
export const getPerformanceInsightKanBanList = async (params: any) => {
  const response = await http.get<any>('getPerformanceInsightKanBanList', {
    search: {
      status_arr: params?.status,
      priority_arr: params?.priority,
      iterate_ids: params?.iteration,
      keyword: params?.keyword,
      created_at: params?.time,
      users: params?.user_ids,
    },
    page: params?.page,
  })
  return {
    list: response.data?.list || [],
    total: response.data?.pager.total || 0,
  }
}

// 获取看板列表数据-加载更多
export const getPerformanceInsightKanBanListMore = async (params: any) => {
  const response = await http.get<any>('getPerformanceInsightKanBanListMore', {
    search: {
      status_arr: params?.status,
      priority_arr: params?.priority,
      iterate_ids: params?.iteration,
      keyword: params?.keyword,
      created_at: params?.time,
      user: params?.user,
      project_ids: params?.project_ids,
    },
    page: params?.page,
  })
  return response.data
}
