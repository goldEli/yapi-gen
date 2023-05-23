export const unassignStatusList: Model.KanbanConfig.Status[] = [
  {
    story_type_id: 571,
    flow_status_id: 1824,
    is_end: 1,
    is_start: 2,
    stories_count: 0,
    attachment_path:
      'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
    status_name: '已关闭',
  },
  {
    story_type_id: 571,
    flow_status_id: 18241,
    is_end: 1,
    is_start: 2,
    stories_count: 33,
    attachment_path:
      'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
    status_name: '已关闭1',
  },
]

export const columnList: Model.KanbanConfig.Column[] = [
  {
    id: 110,
    kanban_config_id: 1,
    name: '规划a阿斯蒂芬爱上你的费劲啊输入框的阿斯顿发水电费中',
    max_num: 1,
    categories: [
      {
        id: 499,
        name: '需求',
        attachment_id: 457,
        status: [
          {
            id: 334,
            kanban_column_id: 110,
            flow_status_id: 1641,
            story_type_id: 499,
            stories_count: 2,
            status_name: '规划中',
            is_start: 1,
            is_end: 2,
            can_flow_status: [1641, 1642, 1644],
          },
          {
            id: 335,
            kanban_column_id: 110,
            flow_status_id: 1642,
            story_type_id: 499,
            stories_count: 1,
            status_name: '实现中',
            is_start: 2,
            is_end: 2,
            can_flow_status: [1642, 1643, 1644],
          },
        ],
        attachment_path:
          'https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png',
      },
      {
        id: 571,
        name: '测试需求类别（jx）',
        attachment_id: 458,
        status: [
          {
            id: 336,
            kanban_column_id: 110,
            flow_status_id: 1821,
            story_type_id: 571,
            stories_count: 2,
            status_name: '规划中',
            is_start: 1,
            is_end: 2,
            can_flow_status: [1821, 1822, 1824],
          },
          {
            id: 337,
            kanban_column_id: 110,
            flow_status_id: 1822,
            story_type_id: 571,
            stories_count: 1,
            status_name: '实现中',
            is_start: 2,
            is_end: 2,
            can_flow_status: [1822, 1821, 1823],
          },
        ],
        attachment_path:
          'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
      },
    ],
  },
  {
    id: 99,
    kanban_config_id: 1,
    name: '已完成',
    max_num: 1,
    categories: [
      {
        id: 499,
        name: '需求',
        attachment_id: 457,
        status: [
          {
            id: 338,
            kanban_column_id: 99,
            flow_status_id: 1643,
            story_type_id: 499,
            stories_count: 0,
            status_name: '已实现',
            is_start: 2,
            is_end: 1,
            can_flow_status: [1643, 1641],
          },
          {
            id: 339,
            kanban_column_id: 99,
            flow_status_id: 1644,
            story_type_id: 499,
            stories_count: 0,
            status_name: '已关闭',
            is_start: 2,
            is_end: 1,
            can_flow_status: [1644, 1641],
          },
        ],
        attachment_path:
          'https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png',
      },
      {
        id: 571,
        name: '测试需求类别（jx）',
        attachment_id: 458,
        status: [
          {
            id: 344,
            kanban_column_id: 99,
            flow_status_id: 1823,
            story_type_id: 571,
            stories_count: 0,
            status_name: '已实现',
            is_start: 2,
            is_end: 2,
            can_flow_status: [1823, 1822, 1824],
          },
        ],
        attachment_path:
          'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
      },
    ],
  },
  {
    id: 5555,
    kanban_config_id: 1,
    name: '123123',
    max_num: 1,
    categories: [
      {
        id: 499,
        name: '需求',
        attachment_id: 457,
        attachment_path:
          'https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png',
        status: [],
      },
      {
        id: 571,
        name: '测试需求类别（jx）',
        attachment_id: 458,
        attachment_path:
          'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
        status: [],
      },
    ],
  },
]
