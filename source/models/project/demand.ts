import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [demandInfo, setDemandInfo] = useState<any>({})
  const [filterHeight, setFilterHeight] = useState<any>(52)
  const [isRefreshComment, setIsRefreshComment] = useState(false)
  const [isShowProgress, setIsShowProgress] = useState(false)
  const [percentShow, setPercentShow] = useState<boolean>(false)
  const [isUpdateStatus, setIsUpdateStatus] = useState<any>(false)
  const [percentVal, setPercentVal] = useState<any>()
  const [uploadStatus, setUploadStatus] = useState<any>('normal')
  const [createCategory, setCreateCategory] = useState<any>({})
  const [statusLogs, setStatusLogs] = useState<any>([])
  const [importExcel, setImportExcel] = useState<any>({})

  const getImportExcelUpdate = async (params: any) => {
    setImportExcel({})
    const result = await services.demand.getImportExcelUpdate(params)
    setImportExcel(result)
  }

  const getImportExcel = async (params: any) => {
    setImportExcel({})
    const result = await services.demand.getImportExcel(params)
    setImportExcel(result)
  }

  const getLoadListFields = async (params: any) => {
    const result = await services.demand.getLoadListFields(params)
    return result
  }

  const getDemandInfo = async (params: any) => {
    const result = await services.demand.getDemandInfo(params)
    setDemandInfo(result)
    return result
  }

  const getDemandChildInfo = async (params: any) => {
    const result = await services.demand.getDemandInfo(params)
    return result
  }

  const getStatusLogs = async (params: any) => {
    const result = await services.demand.getStoryStatusLog(params)
    setStatusLogs(result)
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
    updateDemandCategory,
    getImportDownloadModel,
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
    updateDemandCategory,
    statusLogs,
    getStatusLogs,
    getLoadListFields,
    getImportDownloadModel,
    importExcel,
    getImportExcel,
    getImportExcelUpdate,
    setIsUpdateStatus,
    isUpdateStatus,
  }
}
