/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { store } from '../../store'
import * as http from '../tools/http'

// 获取登录信息
export const getLoginDetail: any = async (isLogin?: boolean) => {
  const response = await http.get('getLoginDetail', {}, { extra: { isLogin } })
  return response
}

// 获取登录者偏好设置 -- 个人预览模式
export const getCompanyUserPreferenceConfig: any = async () => {
  const response = await http.get('getCompanyUserPreferenceConfig')
  return {
    id: response.data.id,
    companyId: response.data.company_id,
    previewModel: response.data.preview_model,
    guidePageConfig: response.data.guide_page_config,
  }
}

// 修改登录者偏好设置 -- 个人预览模式
export const updateCompanyUserPreferenceConfig: any = async (params: any) => {
  await http.post('updateCompanyUserPreferenceConfig', {
    id: params.id,
    preview_model: params.previewModel,
    guide_page_config: params.guidePageConfig,
  })
}

// 退出登录
export const loginOut: any = async () => {
  const response = await http.get('loginOut')
  return response
}

// 跳转登录
export const getTicket = () => {
  const url = new URL(import.meta.env.__SSO_URL__)
  url.searchParams.set('type', '0')
  url.searchParams.set('redirect', location.href)
  url.searchParams.set('target', 'agile')
  url.searchParams.set('language', localStorage.getItem('language') || 'zh')
  localStorage.removeItem('language')

  location.href = url.href
}

// 获取登录者信息
export const getUserDetail: any = async () => {
  const response = await http.get('getUserDetail')

  return response.data
}

// 登录
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
    data = await store.dispatch(getLoginDetail)
  } catch (error) {
    //
  }
  sessionStorage.removeItem('IS_CHECK_TICKET')

  return data
}

// 获取公司信息
export const getCompanyList: any = async () => {
  const response = await http.get('getCompanyList')
  return response
}

// 切换公司
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
  const response = await http.delete('deleteCommentAttach', params)
  return response.data
}

// 获取登录人的菜单权限
export const getMenuPermission: any = async () => {
  const response = await http.get('getMenuPermission')
  return {
    menus: response.data.menus?.map((i: any) => ({
      id: i.id,
      url: i.url,
      permission: i.permission,
      name: i.name,
      children: i.children,
    })),
    priorityUrl: response.data.priority_url,
  }
}

// 我的最近列表
export const getMyRecent: any = async () => {
  const response = await http.get('/b/user/recent')
  return response.data
}
