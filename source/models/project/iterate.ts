import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [iterateInfo, setIterateInfo] = useState<any>({})

  const getIterateInfo = async (params: any) => {
    const result = await services.iterate.getIterateInfo(params)
    setIterateInfo(result)
  }

  const {
    getIterateList,
    addIterate,
    updateIterate,
    deleteIterate,
    getIterateChangeLog,
    updateIterateStatus,
    getIterateStatistics,
  } = services.iterate

  return {
    getIterateList,
    addIterate,
    updateIterate,
    deleteIterate,
    iterateInfo,
    getIterateInfo,
    getIterateChangeLog,
    updateIterateStatus,
    getIterateStatistics,
  }
}
