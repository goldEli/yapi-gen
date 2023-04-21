/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import * as http from '@/tools/http'

export const getAllNoteSet: any = async () => {
  const response: any = await http.get<any>('/b/msgConf/sysList')

  return response.data
}

export const getMyAllNoteSet: any = async () => {
  const response: any = await http.get<any>('/b/msgConf/userConf')

  return response.data
}

export const editMyAllNoteSet: any = async (params: any) => {
  const response: any = await http.post<any>('/b/msgConf/editUserConf', {
    rules: params.length < 1 ? null : params,
  })
  return response
}

// --------------------------------------------------------------------------消息
export const getContactStatistics: any = async () => {
  const response: any = await http.get<any>('/b/msg/contactStatistics', {
    latTime: Math.floor(new Date().valueOf() / 1000) - 5 * 60 * 1000,
  })

  return response.data
}

// export const getContactList: any = async () => {
//   const response: any = await http.get<any>('/b/msg/contactList')

//   return response.data
// }

// export const getDetail: any = async () => {
//   const response: any = await http.get<any>('/b/msg/detail', { msgId: 341 })

//   return response.data
// }

export const getMsg_list: any = async (params: any) => {
  const response: any = await http.post<any>('/b/msg/list', {
    lastId: params.lastId ?? 0,
    read: params.read,
    friendUsername: params.friendUsername ? [params.friendUsername] : undefined,
    customType: params.msgType,
    latTime: params.latTime,
  })

  return response.data
}

export const setReadApi: any = async (params: any) => {
  const response: any = await http.post<any>('/b/msg/setRead', {
    msgIds: params,
  })

  return response
}
// --------------------------------------------------------------------------消息

export const getConfig: any = async (projectId: any) => {
  const response: any = await http.get<any>(
    `/b/project/tip/${projectId}/config`,
  )
  console.log(response.data)

  return response.data.list
}

export const getSysConfig: any = async () => {
  const response: any = await http.get<any>('/b/project/tip/sysConfig')

  return response.data.list
}

export const editSaveConfig: any = async (params: any) => {
  const response: any = await http.post<any>('/b/project/tip/saveConfig', {
    project_id: params.projectId,
    data: params.data,
    type: params.type,
  })
  return response
}
