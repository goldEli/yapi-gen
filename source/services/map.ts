// 导图接口
import { flattenObjectToArray } from '@/views/Encephalogram/until'
import * as http from '../tools/http'
import { addTaskForTable } from '@/views/Encephalogram/until/DbHelper'

// 获取导图任务列表
export const getMapList = async (params: any) => {
  const response = await http.get('getMapList', params)
  // 拆分树，存入indexDB
  if (response.data) {
    const arr = flattenObjectToArray(response.data)
    addTaskForTable(params.project_id, arr)
  }
  return response.data
}
