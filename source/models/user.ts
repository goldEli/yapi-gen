import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [loginInfo, setLoginInfo] = useState<any>({})
  const [userInfo, setUserInfo] = useState<any>({})

  const getLoginDetail = async () => {
    const result = await services.user.getLoginDetail()
    setLoginInfo(result.data)
    return result
  }
  const getUserDetail = async () => {
    const result = await services.user.getUserDetail()

    return result
  }

  const { loginOut, getCompanyList, getGlobalGeneral, updateCompany }
    = services.user

  return {
    loginInfo,
    userInfo,
    getUserDetail,
    loginOut,
    getLoginDetail,
    getCompanyList,
    updateCompany,
    getGlobalGeneral,
  }
}
