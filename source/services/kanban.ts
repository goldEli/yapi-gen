import urls from '@/constants/urls'
import * as http from '@/tools/http'

export const getKanban = async (params: API.Kanban.GetKanban.Params) => {
  const response = await http.get<any, API.Kanban.GetKanban.Result>(
    'getKanban',
    params,
  )
  return response
}

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
  params: API.Kanban.GetKanbanByGroup.Params,
) => {
  const response = await http.get<any, API.Kanban.GetKanbanByGroup.Result>(
    'getKanbanByGroup',
    params,
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
