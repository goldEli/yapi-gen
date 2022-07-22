/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '../tools/http'

export const getStaffList: any = async () => {
  const response = await http.get('getStaffList')
  return response
}

export const updateStaff: any = async (params: any) => {
  const response = await http.post('editStaff', {
    role_id: params.roleId,
    user_id: params.userId,
  })
  return response
}

export const refreshStaff: any = async (params: any) => {
  const response = await http.get('refreshStaff', params)
  return response
}

export const getDepartmentSelectList: any = async (params: any) => {
  const response = await http.get('getDepartmentSelectList', params)
  return response
}

export const getPositionSelectList: any = async (params: any) => {
  const response = await http.get('getPositionSelectList', params)
  return response
}
