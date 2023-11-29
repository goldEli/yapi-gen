/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { store } from '../../store'
import * as http from '../tools/http'

// 获取部门列表
export const getDepartmentList = async (params: any) => {
  const response: any = await http.get<any, any>('getDepartmentList', params)
  return response?.data
}
// 添加部门
export const addDepartment = async (params: any) => {
  const response: any = await http.post<any, any>('addDepartment', params)
  return response
}
// 编辑部门
export const editDepartment = async (params: any) => {
  const response: any = await http.put<any, any>('editDepartment', params)

  return response
}
// 删除部门
export const delDepartment = async (params: any) => {
  const response: any = await http.delete<any, any>('delDepartment', params)

  return response
}
// 获取所有部门
export const getAllDepartment = async (params: any) => {
  const response: any = await http.get<any, any>('getAllDepartment', params)
  return response
}
// 更新员工的部门
export const updateUserDepartment = async (params: any) => {
  const response: any = await http.post<any, any>(
    'updateUserDepartment',
    params,
  )
  return response
}

// 获取职位列表
export const getPositionList = async (params: any) => {
  const response: any = await http.get<any, any>('getPositionList', params)
  return response?.data
}
// 添加职位
export const addPosition = async (params: any) => {
  const response: any = await http.post<any, any>('addPosition', params)
  return response
}
// 编辑职位
export const editPosition = async (params: any) => {
  const response: any = await http.put<any, any>('editPosition', params)

  return response
}
// 删除职位
export const delPosition = async (params: any) => {
  const response: any = await http.delete<any, any>('delPosition', params)

  return response
}
// 更新员工的职位
export const updateUserPosition = async (params: any) => {
  const response: any = await http.post<any, any>('updateUserPosition', params)
  return response
}

// 员工状态
export const updateUserPositionStatus = async (params: any) => {
  const response: any = await http.put<any, any>(
    'updateUserPositionStatus',
    params,
  )
  return response
}
