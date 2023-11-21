// 导图接口
import { flattenObjectToArray } from '@/views/Encephalogram/until'
import * as http from '../tools/http'

// 获取导图任务列表
export const getMapList = async (params: any) => {
  const response = await http.get('getMapList', params)
  // 拆分树，存入indexDB
  const arr = flattenObjectToArray(response.data)
  console.log(arr, 'arrarrarrarrarrarrarr')

  return response.data
}
