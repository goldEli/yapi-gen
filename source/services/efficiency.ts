/* eslint-disable @typescript-eslint/no-loss-of-precision */
// 效能洞察
/* eslint-disable max-lines */
// 缺陷和对比接口 start
// 对比列表
import * as http from '../tools/http'
export const workContrastList = async (
  params: API.Sprint.WorkContrastList.Params,
) => {
  const response = await http.get<any, API.Sprint.WorkContrastList.Result>(
    'workContrastList',
    params,
  )
  const data = response.data
  return {
    ...data,
    list: data.list.map((el: any) => ({
      id: el.user.id,
      userName: el.user.name,
      departmentName: el.user.department.name,
      positionName: el.user.position.name,
      completion_rate: el.completion_rate,
      new: el.new,
      completed: el.completed,
      work_stock: el.work_stock,
      work_progress: el.work_progress,
      repeat_rate: el.repeat_rate,
      risk: el.risk,
    })),
  }
}
// 缺陷分析列表
export const memberBugList = async (
  params: API.Sprint.MemberBugList.Params,
) => {
  const res = await http.get<any, API.Sprint.MemberBugList.Result>(
    'memberBugList',
    params,
  )
  return {
    ...res.data,
    list: res.data.list.map((el: any) => ({
      id: el.user.id,
      userName: el.user.name,
      departmentName: el.user.department.name,
      positionName: el.user.position.name,
      completion_rate: el.completion_rate,
      not_fixed: el.not_fixed,
      fixing: el.fixing,
      fixed: el.fixed,
      repeat_open_rate: el.repeat_open_rate,
      stock_risk: el.stock_risk,
    })),
  }
}
// 后半截弹窗顶部的详情
export const plugSelectionUserInfo = async (params: {
  user_id: number
  project_ids?: number
}) => {
  // const response = await http.get<any, API.Sprint.PlugSelectionUserInfo.Result>(
  //   `b/efficiency/member/search/info`,
  //   params,
  // )
  const response = {
    data: {
      id: 1,
      name: '张三',
      email: 'lijianbo@dingstartech.com',
      department_id: 1542079930036355073,
      job_id: 1542079890593120258,
      avatar:
        'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
      departments: [
        {
          id: 1542079930036355073,
          name: '总经办',
        },
        {
          id: 1542079930036355074,
          name: '副总裁',
        },
      ],
      position: {
        id: 1542079890593120258,
        name: '总助ds',
      },
      status: [
        {
          id: 11462,
          content: '规划中',
        },
        {
          id: 11463,
          content: '实现中',
        },
        {
          id: 11464,
          content: '已完成',
        },
      ],
    },
  }
  return {
    userInfo: {
      id: response.data.id,
      name: response.data.name,
      departments: response.data.departments,
      position: response.data.position,
      email: response.data.email,
      avatar: response.data.avatar,
    },
    status: response.data.status.map(el => ({
      label: el.content,
      value: el.id,
    })),
  }
}
// 进展对比后半截弹窗
export const efficiencyMemberWorkList = async (
  params: API.Sprint.EfficiencyMemberWorkList.Params,
) => {
  // const response = await http.get<
  //   any,
  //   API.Sprint.EfficiencyMemberWorkList.Result
  // >(`efficiencyMemberWorkList`, params)
  const response = {
    data: {
      total: {
        name: '有返工的工作项',
        value: 10,
        unit: '项',
      },
      list: [
        {
          id: 1003429,
          name: '测试123456测试123456',
          story_prefix_key: 'CSXM2-FL-103',
          category_attachment:
            'https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png',
          status: 1,
          user: {
            id: 1,
            name: '张三',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
          },
          relate_users: [
            {
              id: 2,
              name: '杨春平',
              avatar:
                'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
            },
            {
              id: 3,
              name: '汪志君',
              avatar:
                'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
            },
            {
              id: 3,
              name: '付亮',
              avatar: '',
            },
          ],
          expected_end_at: '2023-05-18',
          expected_start_at: '2023-05-18',
          created_at: '2023-05-24 02:46:55',
        },
        {
          id: 1003430,
          name: '测试123456',
          story_prefix_key: 'CSXM2-FL-123456',
          category_attachment:
            'https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png',
          status: 2,
          user: {
            id: 1,
            name: '张三',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
          },
          relate_users: [
            {
              id: 2,
              name: '杨春平',
              avatar:
                'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
            },
            {
              id: 3,
              name: '汪志君',
              avatar:
                'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
            },
            {
              id: 3,
              name: '付亮',
              avatar: '',
            },
          ],
          expected_end_at: '2023-05-18',
          expected_start_at: '2023-05-18',
          created_at: '2023-05-24 02:46:55',
        },
      ],
    },
  }
  return {
    total: response.data.total,
    list: response.data.list.map(el => ({
      id: el.id,
      name: el.name,
      created_at: el.created_at,
      story_prefix_key: el.story_prefix_key,
      category_attachment: el.category_attachment,
      expected_start_at: el.expected_start_at,
      expected_end_at: el.expected_end_at,
      status: el.status,
      relate_users: el.relate_users,
      user: el.user,
    })),
  }
}
// 缺陷分析后半截
export const efficiencyMemberDefectList = async (
  params: API.Sprint.EfficiencyMemberWorkList.Params,
) => {
  // const response = await http.get<
  //   any,
  //   API.Sprint.EfficiencyMemberWorkList.Result
  // >(`efficiencyMemberDefectList`, params)
  const response = {
    data: {
      total: {
        name: '重开缺陷',
        value: 10,
        unit: '项',
      },
      list: [
        {
          id: 1003429,
          name: '测试123456测试123456',
          story_prefix_key: 'CSXM2-FL-103',
          category_attachment:
            'https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png',
          status: 2,
          user: {
            id: 1,
            name: '张三',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
          },
          relate_users: [
            {
              id: 2,
              name: '杨春平',
              avatar:
                'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
            },
            {
              id: 3,
              name: '汪志君',
              avatar:
                'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
            },
            {
              id: 3,
              name: '付亮',
              avatar: '',
            },
          ],
          expected_end_at: '2023-05-18',
          expected_start_at: '2023-05-18',
          created_at: '2023-05-24 02:46:55',
        },
        {
          id: 1003430,
          name: '测试123456',
          story_prefix_key: 'CSXM2-FL-123456',
          category_attachment:
            'https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png',
          status: 3,
          user: {
            id: 1,
            name: '张三',
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
          },
          relate_users: [
            {
              id: 2,
              name: '杨春平',
              avatar:
                'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
            },
            {
              id: 3,
              name: '汪志君',
              avatar:
                'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
            },
            {
              id: 3,
              name: '付亮',
              avatar: '',
            },
          ],
          expected_end_at: '2023-05-18',
          expected_start_at: '2023-05-18',
          created_at: '2023-05-24 02:46:55',
        },
      ],
    },
  }

  return {
    total: response.data.total,
    list: response.data.list.map(
      (el: {
        id: any
        name: any
        created_at: any
        story_prefix_key: any
        category_attachment: any
        expected_start_at: any
        expected_end_at: any
        status: any
        relate_users: any
        user: any
      }) => ({
        id: el.id,
        name: el.name,
        created_at: el.created_at,
        story_prefix_key: el.story_prefix_key,
        category_attachment: el.category_attachment,
        expected_start_at: el.expected_start_at,
        expected_end_at: el.expected_end_at,
        status: el.status,
        relate_users: el.relate_users,
        user: el.user,
      }),
    ),
  }
}
// 工作项和缺陷的卡片
export const getStatisticsTotal = async (
  params: API.Sprint.GetStatisticsTotal.Params,
) => {
  const response = await http.get<any, API.Sprint.GetStatisticsTotal.Result>(
    'getStatisticsTotal',
    params,
  )
  return response.data
}
// 进展对比前半截
export const historyWorkList = async (
  params: API.Efficiency.HistoryWorkList.Params,
) => {
  // const response = await http.get<any, API.Efficiency.historyWorkList.Result>(
  //   `b/efficiency/member/${params.id}/history/work_list`,
  //   params,
  // )
  const res = {
    id: 2,
    name: '李四',
    user_group_id: 3,
    email: 'lijianbo@dingstartech.com',
    avatar:
      'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
    role: {
      id: 3,
      name: '参与者',
    },
    work_record: [
      {
        date: '今天',
        list: [
          {
            id: 1,
            name: '办事大厅相关功能',
            status_from: {
              id: 11462,
              content: '规划中',
            },
            status_to: {
              id: 11463,
              content: '实现中',
            },
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
        ],
      },
      {
        date: '昨天',
        list: [
          {
            id: 2,
            name: '事务相关功能',
            status_from: {
              id: 11462,
              content: '规划中',
            },
            status_to: {
              id: 11463,
              content: '实现中',
            },
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
        ],
      },
    ],
    created_word: [
      {
        status_name: '进行中',
        list: [
          {
            id: 1,
            name: '办事大厅相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
          {
            id: 2,
            name: '事务相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
        ],
      },
      {
        status_name: '已逾期',
        list: [
          {
            id: 1,
            name: '办事大厅相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
          {
            id: 2,
            name: '事务相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
        ],
      },
    ],
    word: [
      {
        status_name: '进行中',
        list: [
          {
            id: 1,
            name: '办事大厅相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
          {
            id: 2,
            name: '事务相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
        ],
      },
      {
        status_name: '已逾期',
        list: [
          {
            id: 1,
            name: '办事大厅相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
          {
            id: 2,
            name: '事务相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
        ],
      },
    ],
  }
  return res
}
// 缺陷分析的前半截
export const historyDefectList = async (
  params: API.Efficiency.HistoryWorkList.Params,
) => {
  // const response = await http.get<any, API.Efficiency.historyWorkList.Result>(
  //   `b/efficiency/member/${params.id}/history/defect_list`,
  //   params,
  // )
  const res = {
    id: 2,
    name: '李四',
    user_group_id: 3,
    email: 'lijianbo@dingstartech.com',
    avatar:
      'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
    role: {
      id: 3,
      name: '参与者',
    },
    work_record: [
      {
        date: '今天',
        list: [
          {
            id: 1,
            name: '办事大厅相关功能',
            status_from: {
              id: 11462,
              content: '规划中',
            },
            status_to: {
              id: 11463,
              content: '实现中',
            },
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
        ],
      },
      {
        date: '昨天',
        list: [
          {
            id: 2,
            name: '事务相关功能',
            status_from: {
              id: 11462,
              content: '规划中',
            },
            status_to: {
              id: 11463,
              content: '实现中',
            },
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
        ],
      },
    ],
    created_word: [
      {
        status_name: '进行中',
        list: [
          {
            id: 1,
            name: '办事大厅相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
          {
            id: 2,
            name: '事务相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
        ],
      },
      {
        status_name: '已逾期',
        list: [
          {
            id: 1,
            name: '办事大厅相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
          {
            id: 2,
            name: '事务相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
        ],
      },
    ],
    word: [
      {
        status_name: '进行中',
        list: [
          {
            id: 1,
            name: '办事大厅相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
          {
            id: 2,
            name: '事务相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
        ],
      },
      {
        status_name: '已逾期',
        list: [
          {
            id: 1,
            name: '办事大厅相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
          {
            id: 2,
            name: '事务相关功能BUG修改',
            parent_name: '项目管理模块',
            expected_start_at: '2023-04-30',
            expected_end_at: '2023-05-30',
            created_at: '2023-04-30 00:00:00',
          },
        ],
      },
    ],
  }
  return res
}
// 缺陷和对比接口 end

// 视图的接口 start
// 视图的列表
export const viewsList = async (parmas: API.Efficiency.ViewsList.Params) => {
  const response = await http.get<any, API.Efficiency.ViewsList.Result>(
    'viewsList',
    parmas,
  )
  return response.data.map(el => ({
    id: el.id,
    name: el.name,
    label: el.name,
    status: el.status,
    type: el.type,
    config: el.config,
    key: String(el.id),
    is_default: el.is_default,
  }))
}
// 视图修改
export const viewsUpdate = async (
  parmas: API.Efficiency.ViewsEditList.Params,
) => {
  const response = await http.put<any, API.Efficiency.ViewsEditList.Result>(
    'viewsUpdate',
    parmas,
  )

  return response.data
}
// 视图新建
export const createViewList = async (
  parmas: API.Efficiency.ViewsEditList.Params,
) => {
  const response = await http.post<any, API.Efficiency.ViewsEditList.Result>(
    'createViewList',
    parmas,
  )
  return response.data
}
// 删除视图
export const delView = async (id: number) => {
  const response = await http.delete<any, API.Efficiency.ViewsEditList.Result>(
    'delView',
    { id },
  )
  return response.data
}
// 设置默认视图
export const defaultView = async (id: number) => {
  const response = await http.patch<any, API.Efficiency.ViewsEditList.Result>(
    'defaultView',
    { id },
  )
  return response.data
}
// 视图的接口 end

// 图表页面 start
// 新增工作top10对比
export const contrastNewWork = async (
  params: API.Sprint.contrastNewWork.Params,
) => {
  const response = await http.get<any, API.Sprint.contrastNewWork.Result>(
    'contrastNewWork',
    params,
  )
  return response.data
}
// 完成率Top10对比
export const getCompletionRate = async (
  params: API.Sprint.GetCompletionRate.Params,
) => {
  const response = await http.get<any, API.Sprint.GetCompletionRate.Result>(
    'getCompletionRate',
    params,
  )
  // const response = {
  //   data: {
  //     list: [
  //       {
  //         user_name: '用户1',
  //         completion_rate: '90%',
  //         work_total: 40,
  //       },
  //       {
  //         user_name: '用户2',
  //         completion_rate: '80%',
  //         work_total: 50,
  //       },
  //       {
  //         user_name: '用户3',
  //         completion_rate: '70%',
  //         work_total: 45,
  //       },
  //       {
  //         user_name: '用户4',
  //         completion_rate: '65%',
  //         work_total: 60,
  //       },
  //       {
  //         user_name: '用户5',
  //         completion_rate: '60%',
  //         work_total: 45,
  //       },
  //       {
  //         user_name: '用户6',
  //         completion_rate: '50%',
  //         work_total: 46,
  //       },
  //       {
  //         user_name: '用户7',
  //         completion_rate: '40%',
  //         work_total: 45,
  //       },
  //       {
  //         user_name: '用户8',
  //         completion_rate: '35%',
  //         work_total: 50,
  //       },
  //       {
  //         user_name: '用户9',
  //         completion_rate: '30%',
  //         work_total: 55,
  //       },
  //       {
  //         user_name: '用户10',
  //         completion_rate: '25%',
  //         work_total: 45,
  //       },
  //     ],
  //     start_time: '2023-04-30',
  //     end_time: '2023-05-15',
  //   },
  // }
  return response.data
}
// 阶段缺陷占比
export const getDefectRatio = async (
  params: API.Sprint.GetDefectRatio.Params,
) => {
  const response = await http.get<any, API.Sprint.GetDefectRatio.Result>(
    'getDefectRatio',
    params,
  )

  return response.data
}
// 2，3，5图表
export const statisticsOther = async (
  params: API.Efficiency.StatisticsOther.Params,
) => {
  const response = await http.get<any, API.Efficiency.StatisticsOther.Result>(
    'statisticsOther',
    params,
  )
  return response.data
}
// 图表页面 end
// 最近的冲刺项目
export const recentCreateData = async (params: {
  resource_type: number
  project_id: number
}) => {
  const response = await http.get<any, API.Sprint.RecentCreateData.Result>(
    'recentCreateData',
    params,
  )
  return response.data
}
export const getExport = async (parmas: API.Sprint.GetExport.Params) => {
  const response = await http.get<any>('export', parmas, {
    responseType: 'blob',
  })
  return response
}
