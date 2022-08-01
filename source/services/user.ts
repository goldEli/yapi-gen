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

export const login = async () => {
  const ticket = new URLSearchParams(location.search).get('ticket')

  const response = await http.put(
    'https://dev.staryuntech.com/api/auth/checkTicket',
    { ticket },
  )

  localStorage.setItem('token', response.data.token)
}

export const getTicket = (toHome?: boolean) => {
  const url = new URL(import.meta.env.__SSO_ORIGIN__)
  url.searchParams.set('type', '0')
  url.searchParams.set(
    'redirect',
    toHome || location.pathname === '/' ? location.href : location.href,
  )
  url.searchParams.set('language', localStorage.getItem('language') || 'zh')

  location.href = url.href
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

    user: {
      total: response.data.user_statistics.user_total,
      boyCount: response.data.user_statistics.user_count[1].count,
      girlCount: response.data.user_statistics.user_count[0].count,
      chartsData: response.data.user_statistics.position_count.map(
        (item: { position_name: any; count: any }) => {
          return {
            type: item.position_name,
            sales: item.count,
          }
        },
      ),
    },

    need: {
      total: response.data.story_statistics.total,
      endTotal: response.data.story_statistics.end_total,
      ongoingTotal: response.data.story_statistics.ongoing_total,
      planningTotal: response.data.story_statistics.planning_total,
      chartsData: (() => {
        const timeData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        response.data.story_statistics.line_list.create.forEach((item: any) => {
          timeData[item.month - 1] = item.number
        })
        const timeData2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        response.data.story_statistics.line_list.ongoing.forEach(
          (item: any) => {
            timeData2[item.month - 1] = item.number
          },
        )
        const timeData3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        response.data.story_statistics.line_list.end.forEach((item: any) => {
          timeData3[item.month - 1] = item.number
        })

        return [
          {
            name: '创建需求',
            data: timeData,
          },
          {
            name: '进行中',
            data: timeData2,
          },
          {
            name: '已结束',
            data: timeData3,
          },
        ]
      })(),
    },

    iterate: {
      ...response.data.iterate_statistics,
      chartsData: [
        {
          type: '进度100%',
          sales: response.data.iterate_statistics.schedule.schedule_100,
        },
        {
          type: '进度90~100%',
          sales: response.data.iterate_statistics.schedule.schedule_pass90,
        },
        {
          type: '进度60%~90%',
          sales: response.data.iterate_statistics.schedule.schedule_pass60,
        },
        {
          type: '进度30%~60%',
          sales: response.data.iterate_statistics.schedule.schedule_pass30,
        },
        {
          type: '进度0%~30%',
          sales: response.data.iterate_statistics.schedule.schedule_pass0,
        },
        {
          type: '进度0%',
          sales: response.data.iterate_statistics.schedule.schedule_0,
        },
      ],
    },
  }
}
