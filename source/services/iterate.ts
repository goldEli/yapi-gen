/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

// 迭代

import * as http from '@/tools/http'
import moment from 'moment'

export const getIterateList: any = async (params: any) => {
  const response: any = await http.get<any>('getIterateList', {
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

export const addIterate: any = async (params: any) => {
  const element = document.createElement('div')
  element.innerHTML = params?.info || ''
  const hasImg = Array.from(element.getElementsByTagName('img'))
  const info = hasImg.length
    ? params?.info
    : element.innerText.trim() === ''
    ? ''
    : element.innerHTML

  await http.post<any>('addIterate', {
    name: params.iterationName,
    info,
    start_at: moment(params.time[0]).format('YYYY-MM-DD'),
    end_at: moment(params.time[1]).format('YYYY-MM-DD'),
    project_id: params.projectId,
  })
}

export const updateIterate: any = async (params: any) => {
  const element = document.createElement('div')
  element.innerHTML = params?.info || ''
  const hasImg = Array.from(element.getElementsByTagName('img'))
  const info = hasImg.length
    ? params?.info
    : element.innerText.trim() === ''
    ? ''
    : element.innerHTML

  await http.patch<any>('editIterate', {
    name: params.iterationName,
    info,
    project_id: params.projectId,
    id: params.id,
    start_at: moment(params.time[0]).format('YYYY-MM-DD'),
    end_at: moment(params.time[1]).format('YYYY-MM-DD'),
  })
}

export const deleteIterate: any = async (params: any) => {
  await http.delete<any>('deleteIterate', {
    project_id: params.projectId,
    id: params.id,
  })
}

export const getIterateInfo: any = async (params: any) => {
  const response: any = await http.get<any>('getIterateInfo', {
    project_id: params.projectId,
    id: params.id,
  })
  return {
    name: response.data.name,
    id: response.data.id,
    info: response.data.info,
    status: response.data.status,
    finishCount: response.data.story_finish_count || 0,
    storyCount: response.data.story_count || 0,
    startTime: response.data.start_at,
    endTime: response.data.end_at,
    changeCount: response.data.app_changelog_count || 0,
    bug_count: response.data.bug_count,
  }
}

export const getIterateChangeLog: any = async (params: any) => {
  const response: any = await http.get<any>('getIterateChangeLog', {
    search: {
      app_id: params.iterateId,
      project_id: params.projectId,
    },
    pagesize: params.pageSize,
    page: params.page,
    orderkey: params.orderKey,
    order: params.order,
  })

  return {
    currentPage: params.page,
    total: response.data.pager.total,
    list: response.data.list.map((i: any) => ({
      id: i.id,
      fields: i.fields,
      userName: i.user_name,
      updateTime: i.created_at,
      type: i.change_log_type,
      beforeField: JSON.stringify(i.before) === '[]' ? {} : i.before,
      afterField: i.after,
    })),
  }
}

export const updateIterateStatus: any = async (params: any) => {
  await http.put<any>('updateIterateStatus', {
    project_id: params.projectId,
    id: params.id,
    status: params.status,
  })
}

export const getIterateStatistics: any = async (params: any) => {
  const response = await http.get<any>('iterateStatistics', {
    project_id: params.projectId,
    iterate_id: params.id,
  })

  return {
    burnDownChart: response.data.burnDownChart,
    storyStatusChart: response.data.storyStatusChart.map((i: any) => ({
      type: i.content,
      count: i.story_count,
    })),
  }
}

export const getAchieveInfo: any = async (params: any) => {
  const response = await http.get<any>('getAchieveInfo', {
    project_id: params.projectId,
    id: params.id,
  })

  return {
    info: response.data.achieve_desc,
    attachList: response.data.iterate_attachment,
  }
}

export const updateAchieve: any = async (params: any) => {
  const element = document.createElement('div')
  element.innerHTML = params?.info || ''
  const hasImg = Array.from(element.getElementsByTagName('img'))
  const info = hasImg.length
    ? params?.info
    : element.innerText.trim() === ''
    ? ''
    : element.innerHTML
  await http.post<any>('updateAchieve', {
    project_id: params.projectId,
    iterate_id: params.id,
    achieve_desc: info,
    attachment: params.attachList,
  })
}

export const finishStatistics: any = async (params: any) => {
  const response = await http.get<any>('finishStatistics', {
    project_id: params.projectId,
    id: params.id,
  })
  return response
}

export const incompleteIterates: any = async (params: any) => {
  const response = await http.get<any>('incompleteIterates', {
    project_id: params.projectId,
    id: params.id,
  })
  return response
}

export const finishIteration: any = async (params: any) => {
  const response = await http.put<any>('finishIteration', {
    project_id: params.projectId,
    id: params.id,
    move_to_id: params.moveId,
    handle_story_type: params.type,
  })
  return response
}
