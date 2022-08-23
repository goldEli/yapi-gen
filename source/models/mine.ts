import * as services from '@/services'
import { useState } from 'react'

export default () => {
  const [isUpdateCreate, setIsUpdateCreate] = useState(false)

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
  }
}
