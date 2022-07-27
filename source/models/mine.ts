import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const {
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
  }
}
