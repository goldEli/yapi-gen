/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import * as http from '@/tools/http'

export const getViews: any = async (params: any) => {
  const response: any = await http.get<any>('/b/story/views/list', {
    project_id: params.projectId,
    use_type: params.type,
  })

  return response.data
}

export const addViews: any = async (params: any) => {
  const response: any = await http.post<any>('/b/story/views/create', params)

  return response
}

export const editViews: any = async (params: any) => {
  const response: any = await http.put<any>('/b/story/views/update', {
    project_id: params.project_id,
    status: params.state ? 1 : 2,
    name: params.name,
    id: params.id,
  })
  return response
}

export const delViews: any = async (params: any) => {
  const response: any = await http.delete<any>('/b/story/views/delete', {
    project_id: params.project_id,
    id: params.id,
  })
  return response
}
