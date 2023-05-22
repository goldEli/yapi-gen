/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import * as http from '@/tools/http'

export const getViews: any = async (params: any) => {
  const response: any = await http.get<any>('/b/story/views/list', {
    project_id: params,
    use_type: 1,
  })

  return response.data
}

export const addViews: any = async (params: any) => {
  params.use_type = 1
  const response: any = await http.post<any>('/b/story/views/create', params)

  return response
}

export const editViews: any = async (params: any) => {
  const response: any = await http.patch<any>(
    `/b/story/views/update/${params.id}?project_id=${params.project_id}`,
    {
      project_id: params.project_id,
      status: params.state ? 1 : 2,
      name: params.name,
      use_type: 1,
    },
  )
  return response
}

export const delViews: any = async (params: any) => {
  const response: any = await http.delete<any>(
    `/b/story/views/delete/${params.id}?project_id=${params.project_id}`,
    {
      project_id: params.project_id,
      use_type: 1,
    },
  )
  return response
}
