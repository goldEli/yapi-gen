/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import * as http from '@/tools/http'
// 创建系统通知
export const createSysNotice: any = async (params: any) => {
  const response: any = await http.post<any>('/b/sys_notice/create', params)

  return response.data
}
//删除通知
export const delSysNotice: any = async (id: any) => {
  const response: any = await http.delete<any>(`/b/sys_notice/${id}/destroy`)

  return response
}
//撤回通知
export const recallSysNotice: any = async (id: any) => {
  const response: any = await http.put<any>(`/b/sys_notice/${id}/recall`)

  return response
}
// 系统通知列表
export const getMyAllSysNotice: any = async (params: any) => {
  const response: any = await http.get<any>('/b/sys_notice/list', params)

  return response.data
}
// 系统通知用户列表
export const getMyAllSysNoticeNumber: any = async (params: any) => {
  const response: any = await http.get<any>(
    '/b/sys_notice/receive/user_list',
    params,
  )

  return response.data
}

// 提交反馈
export const sendFeedback: any = async (params: any) => {
  const response: any = await http.post<any>('/b/feedback/submit', params)

  return response.data
}
