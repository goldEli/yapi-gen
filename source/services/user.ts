/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { decrypt, encrypt } from '../tools/crypto'
import * as http from '../tools/http'

export const getLoginDetail: any = async (isLogin?: boolean) => {
  const response = await http.get('getLoginDetail', {}, { extra: { isLogin } })
  return response
}

export const loginOut: any = async () => {
  const response = await http.get('loginOut')
  return response
}

export const getTicket = () => {
  const url = new URL(import.meta.env.__SSO_URL__)
  url.searchParams.set('type', '0')
  url.searchParams.set('redirect', location.href)
  url.searchParams.set('target', 'agile')
  url.searchParams.set('language', localStorage.getItem('language') || 'zh')
  localStorage.removeItem('language')

  location.href = url.href
}

export const getUserDetail: any = async () => {
  const response = await http.get('getUserDetail')

  return response.data
}

export const login = async () => {
  const ticket: any = new URLSearchParams(location.search).get('ticket')

  sessionStorage.setItem('IS_CHECK_TICKET', '1')
  try {
    const response = await http.put(
      `${import.meta.env.__API_ORIGIN__}/api/auth/checkTicket`,
      { ticket },
    )

    localStorage.setItem('agileToken', response.data.token)
  } catch (error) {
    await getTicket()
  }
  let data
  try {
    data = await getLoginDetail(true)
  } catch (error) {
    //
  }
  sessionStorage.removeItem('IS_CHECK_TICKET')

  return data
}

export const getCompanyList: any = async () => {
  const response = await http.get('getCompanyList')
  return response
}

export const updateCompany: any = async (params: any) => {
  await http.put('changeCompany', {
    company_id: params.companyId,
    company_user_id: params.companyUserId,
  })
}

// 全局概况
export const getGlobalGeneral: any = async () => {
  const response = await http.get('getGlobalGeneral')
  return response.data
}

// 删除评论下的附件
export const delCommonAt: any = async (params: any) => {
  const response = await http.delete('/b/story/comment/delete_att', params)
  return response.data
}
