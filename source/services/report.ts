import * as http from '../tools/http'
// 模板

export const writeReport: any = async (params: any) => {
  const response = await http.post('writeReport', { ...params })
  return response
}
