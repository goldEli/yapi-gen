import urls from '@/constants/urls'
import * as http from '@/tools/http'

export const getCategoryList = async (
  params: API.KanbanConfig.GetCategoryList.Params,
) => {
  const response = await http.get<any, API.KanbanConfig.GetCategoryList.Result>(
    'getCategoryList',
    params,
  )
  return response
}

export const getKanbanConfigList = async (
  params: API.KanbanConfig.GetKanbanConfigList.Params,
) => {
  const response = await http.get<
    any,
    API.KanbanConfig.GetKanbanConfigList.Result
  >('getKanbanConfigList', params)
  return response
}

export const getKanbanConfig = async (
  params: API.KanbanConfig.GetKanbanConfig.Params,
) => {
  const response = await http.get<any, API.KanbanConfig.GetKanbanConfig.Result>(
    'getKanbanConfig',
    params,
  )
  return response
}

export const createKanbanConfig = async (
  params: API.KanbanConfig.CreateKanbanConfig.Params,
) => {
  const response = await http.post<
    any,
    API.KanbanConfig.CreateKanbanConfig.Result
  >('createKanbanConfig', params)
  return response
}

export const updateKanbanConfig = async (
  params: API.KanbanConfig.UpdateKanbanConfig.Params,
) => {
  const response = await http.put<
    any,
    API.KanbanConfig.UpdateKanbanConfig.Result
  >(urls.updateKanbanConfig, params)
  return response
}

export const deleteKanbanConfig = async (
  params: API.KanbanConfig.DeleteKanbanConfig.Params,
) => {
  const response = await http.delete<
    any,
    API.KanbanConfig.DeleteKanbanConfig.Result
  >('deleteKanbanConfig', params)
  return response
}

export const getKanbanConfigRemainingStatus = async (
  params: API.KanbanConfig.GetKanbanConfigRemainingStatus.Params,
) => {
  const response = await http.get<
    any,
    API.KanbanConfig.GetKanbanConfigRemainingStatus.Result
  >('getKanbanConfigRemainingStatus', params)
  return response
}
