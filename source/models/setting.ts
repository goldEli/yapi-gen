import { useState } from 'react'
import * as services from '@/services'
import normalCompany from '@/assets/normalCompany.svg'

export default () => {
  const [companyInfo, setCompanyInfo] = useState<any>({})

  const getCompanyInfo = async () => {
    const result = await services.setting.getCompanyInfo()
    result.logo = result.logo || normalCompany
    setCompanyInfo(result)
  }

  const {
    getOperateLogs,
    getLoginLogs,
    getRoleList,
    getRolePermission,
    setRolePermission,
    addRole,
    deleteRole,
    updateRole,
  } = services.setting

  return {
    companyInfo,
    getCompanyInfo,
    getOperateLogs,
    getLoginLogs,
    getRoleList,
    getRolePermission,
    setRolePermission,
    addRole,
    deleteRole,
    updateRole,
  }
}
