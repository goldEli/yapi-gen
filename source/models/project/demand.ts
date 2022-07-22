import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [demandInfo, setDemandInfo] = useState<any>({})

  const getDemandInfo = async (params: any) => {
    const result = await services.demand.getDemandInfo(params)
    setDemandInfo(result)
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
    updatePriority,
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
  }
}
