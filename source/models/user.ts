import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const {
    getUserDetail,
    loginOut,
    getLoginDetail,
    getCompanyList,
    changeCompany,
    getGlobalGeneral,
  } = services.user

  return {
    getUserDetail,
    loginOut,
    getLoginDetail,
    getCompanyList,
    changeCompany,
    getGlobalGeneral,
  }
}
