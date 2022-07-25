/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '../tools/http'

export const getLoginDetail: any = async () => {
  const response = await http.get('getLoginDetail')
  return response
}

export const loginOut: any = async () => {
  const response = await http.get('loginOut')
  return response
}

export const getUserDetail: any = async () => {
  const response = await http.get('getUserDetail')

  return response.data
}

export const getCompanyList: any = async () => {
  const response = await http.get('getCompanyList')
  return response
}

export const updateCompany: any = async (params: any) => {
  const response = await http.put('changeCompany', {
    company_id: params.companyId,
    company_user_id: params.companyUserId,
  })
  return {
    data: response,
  }
}

// 全局概况
export const getGlobalGeneral: any = async () => {
  const response = await http.get('getGlobalGeneral')
  return {
    project: {
      ...response.data.project_statistics,
      chartsData: [
        {
          type: '进度100%',
          sales: response.data.project_statistics.schedule.schedule_100,
        },
        {
          type: '进度50~100%',
          sales: response.data.project_statistics.schedule.schedule_pass50,
        },
        {
          type: '进度0~50%',
          sales: response.data.project_statistics.schedule.schedule_pass0,
        },
        {
          type: '进度0%',
          sales: response.data.project_statistics.schedule.schedule_0,
        },
      ],
    },
    user: response.data.user_statistics,
    need: response.data.story_statistics,
    iterate: response.data.iterate_statistics,
  }
}
