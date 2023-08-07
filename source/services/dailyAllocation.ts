/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import * as http from '@/tools/http'
import moment from 'moment'

//获取日报规则配置

export const getAily_config: any = async (params: any) => {
  const response: any = await http.get<any>('/b/project/daily_config/info', {
    project_id: params,
  })
  return {
    group_name: response.data.config.group_name,
    webhook: response.data.config.webhook,
    is_auto_generate: response.data.is_auto_generate,
    is_auto_send: response.data.is_auto_send,
    is_hand_send: response.data.is_hand_send,
    reminder_time: response.data.reminder_time,
    day: response.data.requirement.day,
    is_holiday: response.data.requirement.is_holiday,
    id: response.data.id,
  }
}
//日报生成规则未配置通知

export const setDaily_config: any = async (params: any) => {
  const response: any = await http.post<any>(
    '/b/project/daily_config/send_notice',
    {
      project_id: params.projectId,
    },
  )

  return response
}
//设置生成配置
export const set_create_config: any = async (params: any) => {
  const response: any = await http.post<any>(
    '/b/project/daily_config/set_create_config',
    params,
  )
  return response
}
//设置自动发送配置
export const set_auto_send_config: any = async (params: any) => {
  const p = {
    id: params.id,
    is_auto_send: params.is_auto_send,
    is_hand_send: params.is_hand_send,
    project_id: params.project_id,
    reminder_time: moment(params.reminder_time).format('HH:mm'),
    send_cycle: {
      day: params.day ?? [],
      is_holiday: params.is_holiday,
    },
  }
  const response: any = await http.post<any>(
    '/b/project/daily_config/set_auto_send_config',
    p,
  )
  return response
}
//项目日报规则配置信息
export const get_auto_send_config: any = async (params: any) => {
  const response: any = await http.get<any>(
    '/b/project/daily_config/config_info',
    {
      project_id: params,
    },
  )
  return response
}
