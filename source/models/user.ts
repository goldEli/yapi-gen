import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [userInfo, setUserInfo] = useState<any>({})

  const getUserDetail = async () => {
    const result = await services.user.getUserDetail()
    setUserInfo(result.data)
    return result.data
  }

  const {
    loginOut,
    getLoginDetail,
    getCompanyList,
    changeCompany,
    getGlobalGeneral,
  } = services.user

  return {
    userInfo,
    getUserDetail,
    loginOut,
    getLoginDetail,
    getCompanyList,
    changeCompany,
    getGlobalGeneral,
  }
}
