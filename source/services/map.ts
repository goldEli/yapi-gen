// 导图接口
import { flattenObjectToArray } from '@/views/Encephalogram/until'
import * as http from '../tools/http'
import { addTaskForTable } from '@/views/Encephalogram/until/DbHelper'
import { store } from '@store/index'
import { setLoading } from '@store/encephalogram'

// 获取导图任务列表
export const getMapList = async (params: any) => {
  store.dispatch(setLoading(true))
  const response = await http.get('getMapList', params)
  // 拆分树，存入indexDB
  if (response.data) {
    const temp = {
      ...response.data,
      project_id: response.data.id,
    }
    const arr = flattenObjectToArray(temp, params.group_by)
    addTaskForTable(params.project_id, arr, params.group_by)
  }
  return response.data
}

// 获取项目组统计信息
export const getMapStatisticInfo = async (params: any) => {
  const response = await http.get('getMapStatisticInfo', params)
  return response.data
}

export const getMapMembers = async (params: any) => {
  const response = await http.get('getMapMembers', params)
  return response.data
}
// 获取例外时间列表
export const getExceptionTimeList = async (params: any) => {
  const response = await http.get('getExceptionTimeList', params)
  return response
}
// 工作时间查询
export const getWorkTimeList = async (params: any) => {
  const response = await http.get('getWorkTimeList', params)
  return response
}
// 添加例外时间
export const addExceptionTime = async (params: any) => {
  const response = await http.get('addExceptionTime', params)
  return response
}
// 编辑例外时间
export const editExceptionTime = async (params: any) => {
  const response = await http.get('editExceptionTime', params)
  return response
}
// 删除例外时间
export const delExceptionTime = async (params: any) => {
  const response = await http.get('delExceptionTime', params)
  return response
}
// 编辑工作时间
export const editWorkTime = async (params: any) => {
  const response = await http.get('editWorkTime', params)
  return response
}
