// 导图接口
import { flattenObjectToArray } from '@/views/Encephalogram/until'
import * as http from '../tools/http'
import { addTaskForTable } from '@/views/Encephalogram/until/DbHelper'
import { store } from '@store/index'
import { setLoading } from '@store/encephalogram'

// 获取导图任务列表
export const getMapList = async (params: any) => {
  if (params.needLoading) {
    store.dispatch(setLoading(true))
  }

  const response = await http
    .get('getMapList', {
      project_id: params.project_id,
      group_by: params.group_by,
    })
    .finally(() => {
      if (params.needLoading) {
        store.dispatch(setLoading(false))
      }
    })
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
  const response = await http.post('addExceptionTime', params)
  return response
}
// 编辑例外时间
export const editExceptionTime = async (params: any) => {
  const response = await http.put('editExceptionTime', params)
  return response
}
// 删除例外时间
export const delExceptionTime = async (params: any) => {
  const response = await http.delete('delExceptionTime', params)
  return response
}
// 编辑工作时间
export const editWorkTime = async (params: any) => {
  const response = await http.put('editWorkTime', params)
  return response
}

export const getIterateList: any = async (params: any) => {
  const response: any = await http.get<any>('mapGetList', {
    search: {
      project_id: params?.projectId,
      name: params?.name,
      created_at: params?.startTime,
      end_at: params?.endTime,
      status: params?.status,
      all: 1,
    },
    orderkey: params.orderKey,
    order: params.order,
  })
  return {
    list: response.data.map((i: any) => ({
      id: i.id,
      status: i.status,
      name: i.name,
      finishCount: i.story_finish_count,
      storyCount: i.story_count,
      createdTime: i.start_at,
      endTime: i.end_at,
      info: i.info,
    })),
  }
}
