/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import * as http from '../tools/http'

export const getHandMember = async (id: any) => {
  const response = await http.get(`/b/companyuser/update_join_projects/${id}`)

  return response.data
}

export const confirmHand = async (params: any) => {
  const response = await http.post(
    `/b/companyuser/update_leave_handover/${params.id}`,
    {
      user_id: params.id,
      projects: params.data,
    },
  )

  return response
}
// --------------------------------

export const getTeamMember = async (params: any) => {
  const response = await http.get(
    `/b/company/teams/${params.team_id}/join_projects/${params.user_id}`,
  )

  return response.data
}

export const confirmTeamHand = async (params: any) => {
  const response = await http.delete('/b/company/teams/member', {
    id: params.id,
    user_id: params.user_id,
    projects: params.data,
  })

  return response
}

// ---------------------

export const getHandProjectMember = async (user_id: any, pId: any) => {
  const response = await http.get(`/b/project/join_projects/${user_id}`, {
    project_id: pId,
  })

  return response.data
}

export const confirmProjectHand = async (params: any) => {
  const response = await http.delete('/b/project/member/delete', {
    user_id: params.id,
    projects: params.data,
    project_id: Number(params.project_id),
  })

  return response
}

// --------------------------------------------
export const restHand = async (id: any) => {
  const response = await http.post(
    `/b/companyuser/update_recover_handover/${id}`,
  )

  return response
}
