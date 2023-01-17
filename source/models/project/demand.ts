/* eslint-disable no-undefined */
import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [isShowProgress, setIsShowProgress] = useState(false)
  const [percentShow, setPercentShow] = useState<boolean>(false)
  const [isUpdateStatus, setIsUpdateStatus] = useState<any>(false)
  const [isUpdateChangeLog, setIsUpdateChangeLog] = useState<any>(false)
  const [percentVal, setPercentVal] = useState<any>()
  const [uploadStatus, setUploadStatus] = useState<any>('normal')
  const [createCategory, setCreateCategory] = useState<any>({})
  const [statusLogs, setStatusLogs] = useState<any>({
    list: undefined,
  })
  const [importExcel, setImportExcel] = useState<any>({})
  // 筛选需求列表参数，用于回填创建需求弹窗
  const [filterParams, setFilterParams] = useState<any>({})

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

  const getExportFields = async (params: any) => {
    const result = await services.demand.getExportFields(params)
    const temp = result.baseFields[0]
    result.baseFields[0] = result.baseFields[1]
    result.baseFields[1] = temp

    return result
  }

  const getDemandChildInfo = async (params: any) => {
    const result = await services.demand.getDemandInfo(params)
    return result
  }

  const getStatusLogs = async (params: any) => {
    const result = await services.demand.getStoryStatusLog(params)
    setStatusLogs({ list: result })
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
    getExportExcel,
    batchDelete,
    batchEdit,
    getBatchEditConfig,
  } = services.demand

  return {
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
    updatePriority,
    addInfoDemand,
    getDemandChildInfo,
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
    setStatusLogs,
    getLoadListFields,
    getImportDownloadModel,
    importExcel,
    getImportExcel,
    getImportExcelUpdate,
    setIsUpdateStatus,
    isUpdateStatus,
    getExportExcel,
    getExportFields,
    setIsUpdateChangeLog,
    isUpdateChangeLog,
    setFilterParams,
    filterParams,
    batchDelete,
    batchEdit,
    getBatchEditConfig,
  }
}
