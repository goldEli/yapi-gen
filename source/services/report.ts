import * as http from '../tools/http'
// 汇报

// 获取汇报详情
export const getReportInfo = async (params: any) => {
  const response = await http.get('getReportInfo', params)
  return response.data
}

// 获取汇报评论
export const getReportComment = async (params: any) => {
  const response = await http.get('getReportComment', params)
  return response.data
}

// 添加评论
export const addReportComment = async (params: any) => {
  await http.post('addReportComment', params)
}

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

export const writeReport: any = async (params: any) => {
  const response = await http.post('writeReport', { ...params })
  return response
}

export const updateReport: any = async (params: any) => {
  const response = await http.put('updateReport', { ...params })
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

export const supplyReport: any = async (params: any) => {
  const response = await http.post('supplyReport', params)
  return response.data
}

// 删除评论
export const delReportComment: any = async (params: any) => {
  const response = await http.delete('delReportComment', params)
  return response.data
}
// 日报配置
const getDailyConfigInfo = async (params: { project_id: number }) => {
  const response = await http.post('dailyConfigInfo', params)
  return response.data
}
// 生成配置
const setDailyConfigSetCreateConfig = async (params: {
  project_id: number
}) => {
  const response = await http.post('dailyConfigSetCreateConfig', params)
  return response.data
}
// 自动发送配置
const dailyConfigSetAutoSendConfig = () => {}
