import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [companyInfo, setCompanyInfo] = useState<any>({})

  const getCompanyInfo = async () => {
    const result = await services.setting.getCompanyInfo()
    setCompanyInfo(result)
  }

  const { getOperateLogs, getLoginLogs, getRoleList, getRolePermission } =
    services.setting

  return {
    companyInfo,
    getCompanyInfo,
    getOperateLogs,
    getLoginLogs,
    getRoleList,
    getRolePermission,
  }
}
