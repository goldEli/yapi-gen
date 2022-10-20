import * as services from '@/services'
import { useState } from 'react'

export default () => {
  const [isUpdateCreate, setIsUpdateCreate] = useState(false)
  const [verifyInfo, setVerifyInfo] = useState<any>({})
  const [count, setCount] = useState({ verifyUser: 0, verify: 0 })

  const getVerifyInfo = async (params: any) => {
    const response = await services.mine.getVerifyInfo(params)
    setVerifyInfo(response)
  }

  const {
    addQuicklyCreate,
    getPeopleList,
    getIterateList,
    getTagList,
    getProjectList,
    getPriOrStu,
    updatePriorityStatus,
    updateDemandStatus,
    getProjectMember,
    getSearchField,
    getField,
    getUserFeedList,
    getMineGatte,
    getMineNeedList,
    getMineNoFinishList,
    getMineFinishList,
    getMineProjectList,
    getMineChartsList,
    getMineCreacteList,
    updateVerifyOperation,
    getVerifyUserList,
    getVerifyList,
  } = services.mine

  return {
    addQuicklyCreate,
    getPeopleList,
    getIterateList,
    getTagList,
    getProjectList,
    getPriOrStu,
    updatePriorityStatus,
    updateDemandStatus,
    getProjectMember,
    getSearchField,
    getField,
    getUserFeedList,
    getMineGatte,
    getMineNeedList,
    getMineNoFinishList,
    getMineFinishList,
    getMineProjectList,
    getMineChartsList,
    getMineCreacteList,
    setIsUpdateCreate,
    isUpdateCreate,
    updateVerifyOperation,
    getVerifyInfo,
    verifyInfo,
    getVerifyUserList,
    getVerifyList,
    setCount,
    count,
  }
}
