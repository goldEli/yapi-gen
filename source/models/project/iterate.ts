import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [iterateInfo, setIterateInfo] = useState<any>({})
  const [selectIterate, setSelectIterate] = useState<any>([])
  const [isRefreshList, setIsRefreshList] = useState<boolean>(false)
  const [isUpdateList, setIsUpdateList] = useState(false)
  const [filterHeightIterate, setFilterHeightIterate] = useState<any>(60)
  const [achieveInfo, setAchieveInfo] = useState<any>({})
  // 筛选需求列表参数，用于回填创建需求弹窗
  const [filterParams, setFilterParams] = useState<any>({})

  const getAchieveInfo = async (params: any) => {
    const result = await services.iterate.getAchieveInfo(params)
    setAchieveInfo(result)
    return result
  }

  const getIterateInfo = async (params: any) => {
    const result = await services.iterate.getIterateInfo(params)
    setIterateInfo(result)
  }

  const getIterateSelectList = async (params: any) => {
    const result = await services.iterate.getIterateList(params)
    setSelectIterate(result)
    return result
  }

  const {
    getIterateList,
    addIterate,
    updateIterate,
    deleteIterate,
    getIterateChangeLog,
    updateIterateStatus,
    getIterateStatistics,
    updateAchieve,
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
    setIsUpdateList,
    isUpdateList,
    getAchieveInfo,
    achieveInfo,
    updateAchieve,
    setFilterParams,
    filterParams,
  }
}
