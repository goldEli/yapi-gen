import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [loginInfo, setLoginInfo] = useState<any>({})
  const [userInfo, setUserInfo] = useState<any>({})
  // 更新语言后： 接口有翻译的接口需要刷新
  const [isRefresh, setIsRefresh] = useState<any>(false)

  const getLoginDetail = async () => {
    const result = await services.user.getLoginDetail()
    setLoginInfo(result.data)
  }
  const getUserDetail = async () => {
    const result = await services.user.getUserDetail()
    setUserInfo(result)
  }

  const {
    loginOut,
    getCompanyList,
    getGlobalGeneral,
    updateCompany,
    getTicket,
    login,
  } = services.user

  return {
    login,
    getTicket,
    loginInfo,
    userInfo,
    getUserDetail,
    loginOut,
    setLoginInfo,
    getLoginDetail,
    getCompanyList,
    updateCompany,
    getGlobalGeneral,
    setIsRefresh,
    isRefresh,
  }
}
