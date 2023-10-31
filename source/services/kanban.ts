import urls from '@/constants/urls'
import { getProjectType } from '@/tools'
import * as http from '@/tools/http'
//
export const deleteStory = async (params: API.Kanban.DeleteStory.Params) => {
  await http.post<any, API.Kanban.DeleteStory.Result>(urls.deleteDemand, params)
}

// getFlowConfig
export const getFlowConfig = async (
  params: API.Kanban.GetFlowConfig.Params,
) => {
  const type = getProjectType()
  const url = type === 2 ? urls.getFlowConfigForSprint : urls.getFlowConfig
  const response = await http.get<any, API.Kanban.GetFlowConfig.Result>(
    url,
    params,
  )
  return response
}

export const delView = async (params: API.Kanban.DelView.Params) => {
  const response = await http.delete<any, API.Kanban.DelView.Result>(
    'delView',
    {
      use_type: 2,
      ...params,
    },
  )
  return response
}

export const createView = async (params: API.Kanban.CreateView.Params) => {
  const response = await http.post<any, API.Kanban.CreateView.Result>(
    'createView',
    params,
  )
  return response
}

export const copyView = async (params: API.Kanban.CopyView.Params) => {
  const response = await http.post<any, API.Kanban.CopyView.Result>(
    urls.copyView,
    params,
  )
  return response
}

export const updateView = async (params: API.Kanban.UpdateView.Params) => {
  const response = await http.put<any, API.Kanban.UpdateView.Result>(
    'updateView',
    params,
  )
  return response
}

export const getKanban = async (
  params: Omit<API.Kanban.GetKanban.Params, 'pagesize' | 'page'>,
) => {
  const response = await http.get<any, API.Kanban.GetKanban.Result>(
    'getKanban',
    {
      pagesize: 30,
      page: 0,
      ...params,
    },
  )
  return response
}

export const updateStoryPriority = async (
  params: API.Kanban.UpdateStoryPriority.Params,
) => {
  const type = getProjectType()
  const url =
    type === 2 ? urls.changeAffairsTableParams : urls.changeTableParams
  await http.put<any, API.Kanban.UpdateStoryPriority.Result>(url, params)
}

export const getStoryViewList = async (
  params: Pick<API.Kanban.GetStoryViewList.Params, 'project_id'>,
) => {
  const response = await http.get<any, API.Kanban.GetStoryViewList.Result>(
    'getStoryViewList',
    {
      ...params,
      use_type: 2,
    },
  )
  return response
}
// getStoryViewList

export const createKanbanPeopleGrouping = async (
  params: API.Kanban.CreateKanbanPeopleGrouping.Params,
) => {
  const response = await http.post<
    any,
    API.Kanban.CreateKanbanPeopleGrouping.Result
  >('createKanbanPeopleGrouping', params)
  return response
}

export const modifyKanbanPeopleGrouping = async (
  params: API.Kanban.ModifyKanbanPeopleGrouping.Params,
) => {
  const response = await http.put<
    any,
    API.Kanban.ModifyKanbanPeopleGrouping.Result
  >('modifyKanbanPeopleGrouping', params)
  return response
}

export const getKanbanByGroup = async (
  params: Omit<API.Kanban.GetKanbanByGroup.Params, 'pagesize' | 'page'>,
) => {
  if (params.search?.iterate_name) {
    params.search.iterate_id = params.search.iterate_name
    delete params.search.iterate_name
  }
  const response = await http.get<any, API.Kanban.GetKanbanByGroup.Result>(
    'getKanbanByGroup',
    {
      pagesize: 30,
      page: 0,
      ...params,
    },
  )
  return response
}

export const modifyKanbanIssueSort = async (
  params: API.Kanban.ModifyKanbanIssueSort.Params,
) => {
  const response = await http.put<any, API.Kanban.ModifyKanbanIssueSort.Result>(
    'modifyKanbanIssueSort',
    params,
  )
  return response
}

export const deleteKanbanGroup = async (
  params: API.Kanban.DeleteStory.Params,
) => {
  const res = await http.delete('deleteKanbanGroup', params)
  return res
}

export const getNewkanbanGroups = async (params: any) => {
  const res = await http.get('/b/project/kanban/groups', params)
  return res.data
}
export const getNewkanbanConfig = async (params: any) => {
  const res = await http.get('/b/project/kanban/config', params)
  return res.data
}
export const getNewkanbanStoriesOfPaginate = async (params: any) => {
  const res = await http.get('/b/project/kanban/storiesOfPaginate', params)
  return res.data
}
export const getNewkanbanStoriesOfList = async (params: any) => {
  const res = await http.get('/b/project/kanban/storiesOfList', params)
  return res
}
export const getNewstoriesOfGroupFirstPage = async (params: any) => {
  const res = await http.get(
    '/b/project/kanban/storiesOfGroupFirstPage',
    params,
  )
  return res.data
}
