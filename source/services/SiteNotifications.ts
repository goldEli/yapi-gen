/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import * as http from '@/tools/http'

export const getAllNoteSet: any = async () => {
  const response: any = await http.get<any>('/b/tipconf')

  return response.data
}

export const getMyAllNoteSet: any = async () => {
  const response: any = await http.get<any>('/b/tipusrconf')

  return response.data
}

export const editMyAllNoteSet: any = async (params: any) => {
  const response: any = await http.post<any>('/b/edittipusrconf', {
    rules: params.length < 1 ? null : params,
  })
  return response
}
