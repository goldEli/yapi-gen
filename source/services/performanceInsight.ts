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
      // users: params?.user_ids,
      users: [
        {
          project_id: 62,
          user_id: 2,
        },
        {
          project_id: 62,
          user_id: 3,
        },
        {
          project_id: 62,
          user_id: 5,
        },
        {
          project_id: 62,
          user_id: 6,
        },
        {
          project_id: 62,
          user_id: 7,
        },
        {
          project_id: 62,
          user_id: 8,
        },
        {
          project_id: 62,
          user_id: 9,
        },
        {
          project_id: 62,
          user_id: 10,
        },
        {
          project_id: 62,
          user_id: 12,
        },
        {
          project_id: 62,
          user_id: 13,
        },
        {
          project_id: 62,
          user_id: 17,
        },
        {
          project_id: 62,
          user_id: 19,
        },
        {
          project_id: 62,
          user_id: 25,
        },
        {
          project_id: 62,
          user_id: 29,
        },
        {
          project_id: 62,
          user_id: 31,
        },
        {
          project_id: 62,
          user_id: 33,
        },
        {
          project_id: 62,
          user_id: 39,
        },
        {
          project_id: 62,
          user_id: 42,
        },
        {
          project_id: 62,
          user_id: 47,
        },
        {
          project_id: 62,
          user_id: 48,
        },
        {
          project_id: 62,
          user_id: 49,
        },
        {
          project_id: 62,
          user_id: 50,
        },
        {
          project_id: 62,
          user_id: 52,
        },
        {
          project_id: 62,
          user_id: 53,
        },
        {
          project_id: 62,
          user_id: 54,
        },
        {
          project_id: 62,
          user_id: 55,
        },
        {
          project_id: 62,
          user_id: 77,
        },
        {
          project_id: 62,
          user_id: 79,
        },
        {
          project_id: 62,
          user_id: 81,
        },
        {
          project_id: 62,
          user_id: 82,
        },
        {
          project_id: 62,
          user_id: 86,
        },
        {
          project_id: 62,
          user_id: 87,
        },
        {
          project_id: 62,
          user_id: 90,
        },
        {
          project_id: 62,
          user_id: 91,
        },
        {
          project_id: 62,
          user_id: 93,
        },
        {
          project_id: 62,
          user_id: 94,
        },
        {
          project_id: 62,
          user_id: 95,
        },
        {
          project_id: 62,
          user_id: 96,
        },
        {
          project_id: 62,
          user_id: 97,
        },
        {
          project_id: 62,
          user_id: 98,
        },
        {
          project_id: 62,
          user_id: 99,
        },
      ],
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
