import urls from '@/constants/urls'
import * as http from '@/tools/http'

export const getSprintList = async (
  params: API.Sprint.GetSprintList.Params,
) => {
  const response = await http.get<any, API.Sprint.GetSprintList.Result>(
    'getSprintList',
    params,
  )
  return response
}
