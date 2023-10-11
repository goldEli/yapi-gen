/* eslint-disable no-promise-executor-return */
import urls from '@/constants/urls'
import * as http from '@/tools/http'

// 获取人员数据
export const getPerformanceInsightKanBanMembers = async () => {
  const response = await http.get<any>('getPerformanceInsightKanBanMembers')
  return response.data?.list || []
}

// 获取统计数据
export const getPerformanceInsightKanBanStatistics = async (params: any) => {
  const response = await http.post<any>(
    'getPerformanceInsightKanBanStatistics',
    {
      search: {
        priority_arr: params?.priority,
        iterate_ids:
          params?.iteration?.[0]?.id === 0
            ? []
            : params?.iteration?.map((i: any) => i.id),
        keyword: params?.keyword,
        created_at: params?.time,
        users: params?.users,
      },
    },
  )
  return response.data
}

// 获取看板列表数据
export const getPerformanceInsightKanBanList = async (params: any) => {
  const response = await http.post<any>('getPerformanceInsightKanBanList', {
    search: {
      status_arr: params?.status,
      priority_arr: params?.priority,
      iterate_ids:
        params?.iteration?.[0]?.id === 0
          ? []
          : params?.iteration?.map((i: any) => i.id),
      keyword: params?.keyword,
      created_at: params?.time,
      users: params?.users,
    },
    page: params?.page,
  })
  return {
    list: response.data?.list || [],
    total: response.data?.pager?.total || 0,
  }
}

// 获取看板列表数据-加载更多
export const getPerformanceInsightKanBanListMore = async (params: any) => {
  const response = await http.post<any>('getPerformanceInsightKanBanListMore', {
    search: {
      status_arr: params?.status,
      priority_arr: params?.priority,
      iterate_ids:
        params?.iteration?.[0]?.id === 0
          ? []
          : params?.iteration?.map((i: any) => i.id),
      keyword: params?.keyword,
      created_at: params?.time,
      user: params?.user,
      project_ids: params?.project_ids,
    },
    story_page: params?.page,
  })
  return response.data
}
