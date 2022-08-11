import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [iterateInfo, setIterateInfo] = useState<any>({})
  const [selectIterate, setSelectIterate] = useState<any>([])
  const [isRefreshList, setIsRefreshList] = useState<boolean>(false)
  const [filterHeightIterate, setFilterHeightIterate] = useState<any>(52)

  const getIterateInfo = async (params: any) => {
    const result = await services.iterate.getIterateInfo(params)
    setIterateInfo(result)
  }

  const getIterateSelectList = async (params: any) => {
    const result = await services.iterate.getIterateList(params)
    setSelectIterate(result)
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
    getIterateSelectList,
    selectIterate,
    setIsRefreshList,
    isRefreshList,
    setFilterHeightIterate,
    filterHeightIterate,
  }
}
