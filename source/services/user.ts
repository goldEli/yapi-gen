/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '../tools/http'

export const getLoginDetail: any = async () => {
  const response = await http.get('getLoginDetail')
  return response
}

export const loginOut: any = async () => {
  const response = await http.get('loginOut')
  return response
}

export const getUserDetail: any = async () => {
  const response = await http.get('getUserDetail')

  return response.data
}

export const getCompanyList: any = async () => {
  const response = await http.get('getCompanyList')
  return response
}

export const updateCompany: any = async (params: any) => {
  const response = await http.put('changeCompany', {
    company_id: params.companyId,
    company_user_id: params.companyUserId,
  })
  return {
    data: response,
  }
}

// 全局概况
export const getGlobalGeneral: any = async (params: any) => {
  const response = await http.put('getGlobalGeneral', params)
  return response
}
