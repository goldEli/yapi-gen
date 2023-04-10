/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import * as http from '@/tools/http'

export const getNotes: any = async (params: any) => {
  const response: any = await http.get<any>('/b/tipconf', {
    project_id: params,
  })

  return response.data
}

export const addViews: any = async (params: any) => {
  const response: any = await http.get<any>('/b/tipusrconf', params)

  return response
}

export const editViews: any = async (params: any) => {
  const response: any = await http.patch<any>(
    `/b/story/views/${params.id}?project_id=${params.project_id}`,
    {
      project_id: params.project_id,
      status: params.state ? 1 : 2,
      name: params.name,
    },
  )
  return response
}

export const delViews: any = async (params: any) => {
  const response: any = await http.delete<any>(
    `/b/story/views/${params.id}?project_id=${params.project_id}`,
    {
      project_id: params.project_id,
    },
  )
  return response
}
