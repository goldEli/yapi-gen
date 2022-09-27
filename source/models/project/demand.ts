import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [demandInfo, setDemandInfo] = useState<any>({})
  const [filterHeight, setFilterHeight] = useState<any>(52)
  const [isRefreshComment, setIsRefreshComment] = useState(false)
  const [isShowProgress, setIsShowProgress] = useState(false)
  const [percentShow, setPercentShow] = useState<boolean>(false)
  const [percentVal, setPercentVal] = useState<any>()
  const [uploadStatus, setUploadStatus] = useState<any>('normal')
  const [createCategory, setCreateCategory] = useState<any>({})

  const getDemandInfo = async (params: any) => {
    const result = await services.demand.getDemandInfo(params)
    setDemandInfo(result)
    return result
  }

  const getDemandChildInfo = async (params: any) => {
    const result = await services.demand.getDemandInfo(params)
    return result
  }

  const {
    updateDemandStatus,
    getDemandList,
    getDemandChangeLog,
    getCommentList,
    addComment,
    deleteComment,
    addDemand,
    updateDemand,
    deleteDemand,
    deleteInfoDemand,
    addInfoDemand,
    updatePriority,
    updateTableParams,
  } = services.demand

  return {
    updateDemandStatus,
    demandInfo,
    getDemandInfo,
    getDemandList,
    getDemandChangeLog,
    getCommentList,
    addComment,
    deleteComment,
    addDemand,
    updateDemand,
    deleteDemand,
    deleteInfoDemand,
    updatePriority,
    addInfoDemand,
    setFilterHeight,
    filterHeight,
    getDemandChildInfo,
    setIsRefreshComment,
    isRefreshComment,
    setIsShowProgress,
    isShowProgress,
    percentShow,
    setPercentShow,
    percentVal,
    setPercentVal,
    uploadStatus,
    setUploadStatus,
    setCreateCategory,
    createCategory,
    updateTableParams,
  }
}
