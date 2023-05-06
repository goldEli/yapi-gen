/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '../tools/http'
// 模板
export const createTemplate: any = async (parmas: any) => {
  const response = await http.post('createTemplate', { ...parmas })
  return response
}

export const upDateTemplate: any = async (parmas: any) => {
  const response = await http.put('upDateTemplate', { ...parmas })
  return response
}

export const deleteTemplate: any = async (parmas: any) => {
  const response = await http.delete('deleteTemplate', { id: parmas.id })
  return response
}

export const templateDetail: any = async (parmas: any) => {
  const response = await http.get('templateDetail', {
    id: parmas.id,
    is_edit: parmas.is_edit,
  })
  return response
}

export const templateList: any = async (parmas: any) => {
  const response = await http.get('templateList', { ...parmas })
  return response.data
}
