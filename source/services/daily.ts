/* eslint-disable max-lines */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '@/tools/http'

export const getProjectList: any = async () => {
  const response: any = await http.get<any>('getProjectList', {
    search: {
      self: 1,

      all: 1,
    },
    orderkey: 'name',
    order: 'asc',
  })

  const data = response.data.map((item: any) => {
    return {
      id: item.id,
      title: item.name,
    }
  })
  return data
}

export const getDemandList: any = async (params: any) => {
  const response: any = await http.get<any>('getDemandList', {
    search: {
      project_id: params,

      all: 1,
    },
  })
  return response
}
