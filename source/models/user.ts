import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [userInfo, setUserInfo] = useState<any>({})

  const getUserDetail = async () => {
    const result = await services.user.getUserDetail()
    setUserInfo(result.data)
    return result.data
  }
  const updateCompany = async (params: any) => {
    await services.user.updateCompany(params)
  }

  const { loginOut, getLoginDetail, getCompanyList, getGlobalGeneral }
    = services.user

  return {
    userInfo,
    getUserDetail,
    loginOut,
    getLoginDetail,
    getCompanyList,
    updateCompany,
    getGlobalGeneral,
  }
}
