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
  return { ...response.data, type: '1' }
}

export const getRepReceivedList: any = async (params: any) => {
  const response = await http.get('repReceivedList', params)
  return { ...response.data, type: '2' }
}

export const getRepPublicList: any = async (params: any) => {
  const response = await http.get('repPublicList', params)
  return { ...response.data, type: '3' }
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

// 日报助手：工作日报—获取项目列表
export const getProjectList: any = async (params: any) => {
  const response: any = await http.get<any>('getListOfDaily', params)
  return response?.data
}

// 日报助手：工作日报—获取需求列表(个人日报)
export const getStoryListOfDaily: any = async (params: any) => {
  const response: any = await http.get<any>('getStoryListOfDaily', {
    project_id: params,
  })
  return response
}

// 日报助手：工作汇报初始化数据
export const initDaily: any = async (params: any) => {
  const response = await http.get('getInitDaily', params)
  return response.data
}

// 日报助手：工作日报—模板详情 (个人日报)
export const getDailyInfo: any = async (params: any) => {
  const response = await http.get('getDailyInfo', { project_id: params })
  return {
    configs: response.data?.template_content_configs,
    reportUserList: response.data?.report_user_list,
    id: response.data?.id,
    name: response.data?.name,
    send_time: response.data?.send_time,
    group_name: response.data?.group_name,
    enable_hand_send: response.data?.enable_hand_send,
    is_setting_config: response.data?.is_setting_config,
  }
}

// 日报助手：日报生成规则未配置通知
export const sendNotice: any = async (params: any) => {
  const response = await http.post('sendNotice', params)
  return response.data
}

// 日报助手：日报生成规则未配置通知 (个人日报)
export const writeAssistantReport: any = async (params: any) => {
  const response = await http.post('writeAssistantReport', params)
  return response.data
}

// 日报助手：工作日报—模板详情 (项目日报)
export const getProjectTemplateInfo: any = async (params: any) => {
  const response = await http.get('getProjectTemplateInfo', {
    project_id: params,
  })
  return {
    configs: response.data?.template_content_configs,
    reportUserList: response.data?.report_user_list,
    id: response.data?.id,
    name: response.data?.name,
    send_time: response.data?.send_time,
    group_name: response.data?.group_name,
    is_setting_project_config: response.data?.is_setting_project_config,
  }
}

// /b/story/
// 日报助手：工作日报—获取需求列表(项目日报)
export const getListOfProjectDaily: any = async (params: any) => {
  const response: any = await http.get<any>('getListOfProjectDaily', {
    project_id: params,
  })
  return response
}

// 日报助手：日报生成规则未配置通知 (个人日报)
export const writeProjectAssistantReport: any = async (params: any) => {
  const response = await http.post('writeProjectAssistantReport', params)
  return response.data
}

// (项目日报)获取汇报详情
export const getProjectReportInfo = async (params: any) => {
  const response = await http.get('getProjectReportInfo', params)
  return response.data
}

// 项目日报-添加分组
export const addGroup = async (params: any) => {
  const response = await http.post('addGroup', params)
  return response.data
}

// 项目日报-删除分组
export const editGroup = async (params: any) => {
  const response = await http.post('editGroup', params)
  return response.data
}
// 项目日报-删除分组
export const removeGroup = async (params: any) => {
  const response = await http.post('removeGroup', params)
  return response.data
}
// 项目日报-移除成员
export const removeMember = async (params: any) => {
  const response = await http.post('removeMember', params)
  return response.data
}

// 项目日报-查询成员
export const getGroupUserList = async (params: any) => {
  const response = await http.get('getGroupUserList', params)
  return response.data
}
