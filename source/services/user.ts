import { log } from '@jihe/secure-log'
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
  console.log(response)

  return response
}
export const getCompanyList: any = async () => {
  const response = await http.get('getCompanyList')
  return response
}
export const changeCompany: any = async (params: any) => {
  const response = await http.put('changeCompany', params)
  return response
}
//全局概况
export const getGlobalGeneral: any = async (params: any) => {
  const response = await http.put('getGlobalGeneral', params)
  return response
}
