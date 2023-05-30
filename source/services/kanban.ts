import urls from '@/constants/urls'
import * as http from '@/tools/http'

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
      pagesize: 20,
      page: 0,
      ...params,
    },
  )
  return response
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
  const response = await http.get<any, API.Kanban.GetKanbanByGroup.Result>(
    'getKanbanByGroup',
    {
      pagesize: 20,
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
