/* eslint-disable no-promise-executor-return */
import urls from '@/constants/urls'
import * as http from '@/tools/http'

// 获取人员数据
export const getPerformanceInsightPersonList = async (params: any) => {
  const response = await http.get<any>('getPerformanceInsightPersonList', {
    status: params.status,
    user_ids: params.user_ids?.join(','),
    start_time: params.time[0] ?? null,
    end_time: params.time[1] ?? null,
    keyword: params.keyword ?? '',
    is_star: params.isStart ? 1 : 2,
  })
  return response.data
}
