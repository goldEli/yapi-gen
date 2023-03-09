/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import * as http from '../tools/http'

export const getHandMember = async (id: any) => {
  const response = await http.get(`/b/companyuser/join_projects/${id}`)

  return response.data
}

export const confirmHand = async (params: any) => {
  const response = await http.post(
    `/b/companyuser/leave_handover/${params.id}`,
    {
      user_id: params.id,
      projects: params.data,
    },
  )

  return response
}

export const restHand = async (id: any) => {
  const response = await http.post(`/b/companyuser/recover_handover/${id}`)

  return response
}
