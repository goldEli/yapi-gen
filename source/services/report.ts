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

export const supplyList: any = async (params: any) => {
    const response = await http.get('supplyList', { ...params })
    return response
  }

export const getReportDetailById: any = async (params: any) => {
    const response = await http.get('getReportDetailById', { ...params })
    return response
  }

export const getRepSentList: any = async (params: any) => {
  const response = await http.get('repSentList', params)
  return response.data
}

export const getRepReceivedList: any = async (params: any) => {
  const response = await http.get('repReceivedList', params)
  return response.data
}

export const getRepPublicList: any = async (params: any) => {
  const response = await http.get('repPublicList', params)
  return response.data
}
