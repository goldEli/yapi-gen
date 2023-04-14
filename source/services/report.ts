import * as http from '../tools/http'
// 汇报

export const getStatTempList: any = async () => {
  const response = await http.get('statTempList')
  return response.data
}

export const getStatUserList: any = async (params: any) => {
  const response = await http.get('statUserList', params)
  return response.data
}

export const getStatInfo: any = async () => {
  const response = await http.get('statInfo')
  return response.data
}

export const getStatTempUsage: any = async () => {
  const response = await http.get('statTempUsage')
  return response.data
}
// 模板

export const writeReport: any = async (params: any) => {
  const response = await http.post('writeReport', { ...params })
  return response
}

export const templateLatelyList: any = async (params: any) => {
  const response = await http.get('templateLatelyList', { ...params })
  return response
}
