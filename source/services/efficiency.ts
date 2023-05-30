/* eslint-disable @typescript-eslint/no-loss-of-precision */
// 效能洞察
import * as http from '@/tools/http'
// 对比列表
export const workContrastList = async (
  params: API.Sprint.GetDefectRatio.Params,
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
  // const response = await http.get<any, API.Sprint.GetStatisticsTotal.Result>(
  //   `getStatisticsTotal`,
  //   params,
  // )
  const response = {
    data: {
      work: [
        {
          name: '完成率',
          value: 50,
          unit: '%',
          icon: 'chart-02',
        },
        {
          name: '新增工作项',
          value: 40,
          unit: '项',
          icon: 'chart-01',
        },
        {
          name: '已完成工作项',
          value: 20,
          unit: '项',
          icon: 'clock-check',
        },
        {
          name: '工作项存量',
          value: 200,
          unit: '项',
          icon: 'demand',
        },
        {
          name: '存量风险',
          value: 10,
          unit: '项',
          icon: 'warning-02',
        },
      ],
      defect: [
        {
          name: '缺陷修复率',
          value: 60,
          unit: '%',
          icon: 'chart-03',
        },
        {
          name: '待修复',
          value: 20,
          unit: '项',
          icon: 'time',
        },
        {
          name: '修复中',
          value: 20,
          unit: '项',
          icon: 'chart-04',
        },
        {
          name: '已完成',
          value: 60,
          unit: '项',
          icon: 'check-circle',
        },
        {
          name: '缺陷存量',
          value: 120,
          unit: '项',
          icon: 'bug',
        },
      ],
      start_time: '2023-04-30',
      end_time: '2023-05-15',
    },
  }
  return response.data
}
// 进展对比前半截
export const historyWorkList = async (
  params: API.Efficiency.historyWorkList.Params,
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
  params: API.Efficiency.historyWorkList.Params,
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

// 图表页面
// 完成率Top10
export const getCompletionRate = async (
  params: API.Sprint.GetCompletionRate.Params,
) => {
  const response = await http.get<any, API.Sprint.GetCompletionRate.Result>(
    'getCompletionRate',
    params,
  )
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
