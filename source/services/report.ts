import * as http from '../tools/http'
// 汇报

export const writeReport: any = async (params: any) => {
  const response = await http.post('writeReport', { ...params })
  return response
}

export const templateLatelyList: any = async (params: any) => {
    const response = await http.get('templateLatelyList', { ...params })
    return response
  }
