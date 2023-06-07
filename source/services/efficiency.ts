/* eslint-disable @typescript-eslint/no-loss-of-precision */
// 效能洞察
/* eslint-disable max-lines */
// 缺陷和对比接口 start
// 对比列表
import * as http from '../tools/http'
export const workContrastList = async (
  params: API.Sprint.WorkContrastList.Params,
) => {
  // const response = await http.get<any, API.Sprint.WorkContrastList.Result>(
  //     'workContrastList',
  //     params,
  // )
  const list = [
    {
      user: {
        id: 1,
        name: '张三',
        department_id: 1542079930036355073,
        job_id: 1542079890593120258,
        avatar:
          'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
        department: {
          id: 1542079930036355073,
          name: '总经办',
        },
        position: {
          id: 1542079890593120258,
          name: '总助ds',
        },
      },
      completion_rate: '50%',
      new: 40,
      completed: 20,
      work_stock: 200,
      work_progress: '10|30 33%',
      repeat_rate: '50%',
      risk: 10,
    },
    {
      user: {
        id: 2,
        name: '李四',
        department_id: 1542079930036355073,
        job_id: 1542079890593120258,
        avatar:
          'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
        department: {
          id: 1542079930036355073,
          name: 'php小组',
        },
        position: {
          id: 1542079890593120258,
          name: 'php工程师',
        },
      },
      completion_rate: '50%',
      new: 40,
      completed: 20,
      work_stock: 200,
      work_progress: '10|30 33%',
      repeat_rate: '50%',
      risk: 10,
    },
  ]
  return {
    work: [
      {
        name: '总完成率',
        value: 50,
        unit: '%',
      },
      {
        name: '当期新增',
        value: 40,
        unit: '项',
      },
      {
        name: '当期已完成',
        value: 20,
        unit: '项',
      },
      {
        name: '总工作存量',
        value: 200,
        unit: '项',
      },
      {
        name: '存量风险',
        value: 10,
        unit: '项',
      },
    ],
    pager: {
      total: 155,
      page: 1,
      pagesize: 20,
    },
    list: list.map((el: any) => ({
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
  // const res = await http.get<any, API.Sprint.MemberBugList.Result>(
  //   'memberBugList',
  //   params,
  // )
  const res = {
    data: {
      defect: [
        {
          name: '缺陷修复率',
          value: 60,
          unit: '%',
        },
        {
          name: '待修复',
          value: 20,
          unit: '项',
        },
        {
          name: '修复中',
          value: 20,
          unit: '项',
        },
        {
          name: '已完成',
          value: 60,
          unit: '项',
        },
        {
          name: '缺陷存量',
          value: 120,
          unit: '项',
        },
        {
          name: '缺陷重开率',
          value: 33,
          unit: '%',
        },
        {
          name: '存量风险',
          value: 30,
          unit: '项',
        },
      ],
      list: [
        {
          user: {
            id: 1,
            name: '张三',
            department_id: 1542079930036355073,
            job_id: 1542079890593120258,
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
            department: {
              id: 1542079930036355073,
              name: '总经办',
            },
            position: {
              id: 1542079890593120258,
              name: '总助ds',
            },
          },
          completion_rate: '50%',
          not_fixed: 20,
          fixing: 20,
          fixed: 60,
          repeat_open_rate: '10|20 50%',
          stock_risk: 5,
        },
        {
          user: {
            id: 2,
            name: '李四',
            department_id: 1542079930036355073,
            job_id: 1542079890593120258,
            avatar:
              'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
            department: {
              id: 1542079930036355073,
              name: '总经办',
            },
            position: {
              id: 1542079890593120258,
              name: '总助ds',
            },
          },
          completion_rate: '50%',
          not_fixed: 20,
          fixing: 20,
          fixed: 60,
          repeat_open_rate: '10|20 50%',
          stock_risk: 5,
        },
      ],
      pager: {
        total: 155,
        page: 1,
        pagesize: 20,
      },
    },
  }
  return {
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
    pager: {
      total: 155,
      page: 1,
      pagesize: 20,
    },
    defect: [
      {
        name: '缺陷修复率',
        value: 60,
        unit: '%',
      },
      {
        name: '待修复',
        value: 20,
        unit: '项',
      },
      {
        name: '修复中',
        value: 20,
        unit: '项',
      },
      {
        name: '已完成',
        value: 60,
        unit: '项',
      },
      {
        name: '缺陷存量',
        value: 120,
        unit: '项',
      },
      {
        name: '缺陷重开率',
        value: 33,
        unit: '%',
      },
      {
        name: '存量风险',
        value: 30,
        unit: '项',
      },
    ],
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
    `getStatisticsTotal`,
    params,
  )
  // const response = {
  //   data: {
  //     work: [
  //       {
  //         name: '完成率',
  //         value: 50,
  //         unit: '%',
  //         icon: 'chart-02',
  //       },
  //       {
  //         name: '新增工作项',
  //         value: 40,
  //         unit: '项',
  //         icon: 'chart-01',
  //       },
  //       {
  //         name: '已完成工作项',
  //         value: 20,
  //         unit: '项',
  //         icon: 'clock-check',
  //       },
  //       {
  //         name: '工作项存量',
  //         value: 200,
  //         unit: '项',
  //         icon: 'demand',
  //       },
  //       {
  //         name: '存量风险',
  //         value: 10,
  //         unit: '项',
  //         icon: 'warning-02',
  //       },
  //     ],
  //     defect: [
  //       {
  //         name: '缺陷修复率',
  //         value: 60,
  //         unit: '%',
  //         icon: 'chart-03',
  //       },
  //       {
  //         name: '待修复',
  //         value: 20,
  //         unit: '项',
  //         icon: 'time',
  //       },
  //       {
  //         name: '修复中',
  //         value: 20,
  //         unit: '项',
  //         icon: 'chart-04',
  //       },
  //       {
  //         name: '已完成',
  //         value: 60,
  //         unit: '项',
  //         icon: 'check-circle',
  //       },
  //       {
  //         name: '缺陷存量',
  //         value: 120,
  //         unit: '项',
  //         icon: 'bug',
  //       },
  //     ],
  //     start_time: '2023-04-30',
  //     end_time: '2023-05-15',
  //   },
  // }
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
    `viewsList`,
    parmas,
  )
  // const response = {
  //   data: [
  //     {
  //       id: 27,
  //       name: '系统视图-周期时间',
  //       config: {
  //         project_id: [441, 437],
  //         user_ids: [1],
  //         start_time: '',
  //         end_time: '',
  //         period_time: 'four_week',
  //         iterate_ids: [],
  //       },
  //       status: -69632682.78917724,
  //       type: 1,
  //       is_default: 1,
  //     },
  //     {
  //       id: 28,
  //       name: '开始和结束',
  //       config: {
  //         iterate_ids: [],
  //         project_id: [441, 437],
  //         user_ids: [1],
  //         start_time: '2023-10-10',
  //         end_time: '2023-10-11',
  //         period_time: '',
  //       },
  //       status: -77288136.07175744,
  //       type: 2,
  //       is_default: 2,
  //     },
  //     {
  //       id: 89,
  //       name: '只有迭代参数',
  //       config: {
  //         project_id: [441, 437],
  //         user_ids: [1],
  //         iterate_ids: [9970],
  //         start_time: '',
  //         end_time: '',
  //         period_time: '',
  //       },
  //       status: -79455814.85011317,
  //       type: 2,
  //       is_default: 2,
  //     },
  //     {
  //       id: 74,
  //       name: '周期时间',
  //       config: {
  //         project_id: [441, 437],
  //         user_ids: [1],
  //         iterate_ids: [],
  //         start_time: '',
  //         end_time: '',
  //         period_time: 'two_week',
  //       },
  //       status: 32169567.50605288,
  //       type: 2,
  //       is_default: 2,
  //     },
  //   ],
  // }
  console.log('response', response)
  return response.data.map(el => ({
    id: el.id,
    name: el.name,
    label: el.name,
    status: el.status,
    type: el.type,
    config: el.config,
    key: el.id + '',
    is_default: el.is_default,
  }))
}
// 视图修改
export const viewsUpdate = async (
  parmas: API.Efficiency.ViewsEditList.Params,
) => {
  // const response = await http.put<any, API.Efficiency.ViewsEditList.Result>(
  //   `viewsUpdate`,
  //   parmas,
  // )
  console.log(parmas, 'parmas')
  return ''
}
// 视图新建
export const createViewList = async (
  parmas: API.Efficiency.ViewsEditList.Params,
) => {
  // const response = await http.post<any, API.Efficiency.ViewsEditList.Result>(
  //   `createViewList`,
  //   parmas,
  // )
  console.log(parmas, 'parmas')
  // return response.data
}
// 删除视图
export const delView = async (id: number) => {
  const response = await http.delete<any, API.Efficiency.ViewsEditList.Result>(
    `delView`,
    id,
  )
  return response.data
}
// 设置默认视图
export const defaultView = async (id: number) => {
  const response = await http.patch<any, API.Efficiency.ViewsEditList.Result>(
    `defaultView`,
    id,
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
  console.log('response-----', response)
  // const response = {
  //   data: {
  //     list: [
  //       {
  //         user_name: '用户1',
  //         work_total: 40,
  //       },
  //       {
  //         user_name: '用户2',
  //         work_total: 50,
  //       },
  //       {
  //         user_name: '用户3',
  //         work_total: 45,
  //       },
  //       {
  //         user_name: '用户4',
  //         work_total: 60,
  //       },
  //       {
  //         user_name: '用户5',
  //         work_total: 45,
  //       },
  //       {
  //         user_name: '用户6',
  //         work_total: 46,
  //       },
  //       {
  //         user_name: '用户7',
  //         work_total: 45,
  //       },
  //       {
  //         user_name: '用户8',
  //         work_total: 50,
  //       },
  //       {
  //         user_name: '用户9',
  //         work_total: 55,
  //       },
  //       {
  //         user_name: '用户10',
  //         work_total: 45,
  //       },
  //     ],
  //     period_number: 14,
  //     growth_rate: '10%',
  //     start_time: '2023-04-30',
  //     end_time: '2023-05-13',
  //   },
  // }
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
  // const response = {
  //   data: {
  //     list: [
  //       {
  //         name: '严重',
  //         number: 2,
  //         ratio: '40%',
  //       },
  //       {
  //         name: '一般',
  //         number: 2,
  //         ratio: '40%',
  //       },
  //       {
  //         name: '致命',
  //         number: 1,
  //         ratio: '20%',
  //       },
  //     ],
  //     start_time: '2023-04-30',
  //     end_time: '2023-05-13',
  //   },
  // }
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
  // const response = {
  //   data: {
  //     work_completion_period: {
  //       list: [
  //         {
  //           completed: 10,
  //           start_time: '2023-03-05',
  //           end_time: '2023-03-11',
  //         },
  //         {
  //           completed: 12,
  //           start_time: '2023-03-12',
  //           end_time: '2023-03-18',
  //         },
  //         {
  //           completed: 14,
  //           start_time: '2023-03-19',
  //           end_time: '2023-03-25',
  //         },
  //         {
  //           completed: 16,
  //           start_time: '2023-03-26',
  //           end_time: '2023-04-01',
  //         },
  //         {
  //           completed: 15,
  //           start_time: '2023-04-02',
  //           end_time: '2023-04-08',
  //         },
  //         {
  //           completed: 16,
  //           start_time: '2023-04-09',
  //           end_time: '2023-04-15',
  //         },
  //         {
  //           completed: 17,
  //           start_time: '2023-04-16',
  //           end_time: '2023-04-22',
  //         },
  //         {
  //           completed: 18,
  //           start_time: '2023-04-23',
  //           end_time: '2023-04-29',
  //         },
  //         {
  //           completed: 20,
  //           start_time: '2023-04-30',
  //           end_time: '2023-05-06',
  //         },
  //       ],
  //       period_number: 7,
  //       growth_rate: '15%',
  //       start_time: '2023-04-30',
  //       end_time: '2023-05-06',
  //     },
  //     risk_stock: {
  //       total: 20,
  //       start_time: '2023-12-08',
  //       end_time: '2023-12-09',
  //       list: [
  //         {
  //           name: '超14天',
  //           number: 10,
  //           ratio: '30%',
  //         },
  //         {
  //           name: '超1个月',
  //           number: 10,
  //           ratio: '10%',
  //         },
  //         {
  //           name: '超3个月',
  //           number: 30,
  //           ratio: '78%',
  //         },
  //         {
  //           name: '超6个月',
  //           number: -35378085,
  //           ratio: '80%',
  //         },
  //         {
  //           name: 'A long time ago',
  //           number: 69489746,
  //           ratio: '80%',
  //         },
  //       ],
  //     },
  //     defect_trend: {
  //       fixed_rate: '60%',
  //       new_total: 100,
  //       fixed_total: 60,
  //       not_fixed: [
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-04-30',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-01',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-02',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-03',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-04',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-05',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-06',
  //         },
  //       ],
  //       fixing: [
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-04-30',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-01',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-02',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-03',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-04',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-05',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-06',
  //         },
  //       ],
  //       fixed: [
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-04-30',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-01',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-02',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-03',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-04',
  //         },
  //         {
  //           number: 10,
  //           rate: '20%',
  //           date: '2023-05-05',
  //         },
  //         {
  //           number: 15,
  //           rate: '25%',
  //           date: '2023-05-06',
  //         },
  //       ],
  //       start_time: '2023-04-30',
  //       end_time: '2023-05-06',
  //     },
  //   },
  // }
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
  return [
    {
      content: '创建【需求】',
      created_at: '2023-05-11 14:22:46',
      feedable: {
        id: 1003237,
        name: '23454',
        status: null,
        project_id: 412,
        deleted_at: null,
      },
      feedable_id: 1003237,
      feedable_type: 'story',
      id: 9970,
      key: 9970,
    },
    {
      content: '创建【需求123】',
      created_at: '2023-05-11 19:22:46',
      feedable: {
        id: 1003237,
        name: '23454',
        status: null,
        project_id: 412,
        deleted_at: null,
      },
      feedable_id: 1003237,
      feedable_type: 'story',
      id: 9971,
      key: 9971,
    },
  ]
}
export const getExport = async (parmas: API.Sprint.GetExport.Params) => {
  const response = await http.get<any>('export', parmas, {
    responseType: 'blob',
  })
  return response
}
