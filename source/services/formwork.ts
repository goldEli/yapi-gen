import * as http from '../tools/http'
//模板
export const createTemplate: any = async (parmas: { name: string }) => {
  const response = await http.post('createTemplate', { ...parmas })
  return response
}
export const upDateTemplate: any = async (parmas: { id: string | number }) => {
  const response = await http.put('upDateTemplate', { id: parmas.id })
  return response
}
export const deleteTemplate: any = async (parmas: { id: string | number }) => {
  const response = await http.delete('deleteTemplate', { id: parmas.id })
  return response
}
export const templateDetail: any = async (parmas: { id: string | number }) => {
  const response = await http.get(`templateDetail`, { id: parmas.id })
  return response
}
export const templateList: any = async (parmas: { id: string | number }) => {
  const response = await http.get(`templateList`)
  return response.data
}
