// 导图接口
import * as http from '../tools/http'

// 获取导图任务列表
export const getMapList = async (params: any) => {
  const response = await http.get('getMapList', params)
  return response.data
}
