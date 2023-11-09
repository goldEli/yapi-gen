/* eslint-disable no-undefined */
/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

// 我的

import * as http from '../tools/http'

export const getWarnStatistics = async (params: any) => {
  const response = await http.get('/b/project/warning/story/count', params)
  return response.data
}

export const getWarnLlist = async (params: any) => {
  const response = await http.get('/b/project/warning/story/list', params)
  return response.data
}
export const getWarnSave = async (params: any) => {
  const response = await http.post('/b/project/warning/read/save', params)
  return response
}
