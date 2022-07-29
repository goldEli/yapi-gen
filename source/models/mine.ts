import * as services from '@/services'

export default () => {
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
  }
}
