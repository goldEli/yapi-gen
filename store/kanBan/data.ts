export const kanbanConfig: Model.KanbanConfig.Config = {
  id: 1,
  project_id: 321,
  name: '看板（jxl）',
  is_default: 1,
  columns: [
    {
      id: 110,
      kanban_config_id: 1,
      name: '规划中',
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
              status_color: '#FA9746',
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
              status_color: '#43BA9A',
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
              status_color: '#BBBDBF',
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
              status_color: '#43BA9A',
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
  ],
}
export const kanbanInfo: Model.KanBan.Column[] = [
  {
    id: 112,
    kanban_config_id: 1,
    name: '规划中',
    max_num: 1,
    stories: [
      {
        id: 1003010,
        name: '需求测试12（jxl）',
        category_id: 571,
        schedule: 0,
        priority: 0,
        created_at: '2023-03-22 18:07:39',
        story_prefix_key: 'CSXM（JXL）-2',
        children_count: 0,
        category_status: {
          id: 1821,
          category_id: 571,
          status_id: 9540,
          is_start: 1,
          is_end: 2,
          status_name: '规划中',
          color: '#FA9746',
        },
        project_category: {
          id: 571,
          name: '测试需求类别（jx）',
          attachment_path:
            'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
        },
        story_config_priority: {
          id: 0,
          name: '无优先级',
          content_txt: '',
          group_content_txt: '',
        },
        handlers: [
          {
            id: 689,
            name: '蒋晓龙',
            avatar: '',
          },
        ],
      },
      {
        id: 1002929,
        name: '个人中心（jxl）',
        category_id: 499,
        schedule: 0,
        priority: 9535,
        created_at: '2023-03-16 09:32:00',
        story_prefix_key: 'CSXM（JXL）-1',
        children_count: 0,
        category_status: {
          id: 1821,
          category_id: 571,
          status_id: 9540,
          is_start: 1,
          is_end: 2,
          status_name: '规划中',
          color: '#FA9746',
        },
        project_category: {
          id: 499,
          name: '需求',
          attachment_path:
            'https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png',
        },
        story_config_priority: {
          id: 9535,
          name: '极高',
          content: '极高',
          color: '#FF5C5E',
          icon: 'extremely-high',
          identity: 'priority',
          content_txt: '极高',
          group_content_txt: '',
        },
        handlers: [
          {
            id: 689,
            name: '蒋晓龙',
            avatar: '',
          },
        ],
      },
      {
        id: 1003095,
        name: '需求测试',
        category_id: 499,
        schedule: 0,
        priority: 0,
        created_at: '2023-03-24 18:52:40',
        story_prefix_key: 'CSXM（JXL）-3',
        children_count: 0,
        category_status: {
          id: 1642,
          category_id: 499,
          status_id: 9541,
          is_start: 2,
          is_end: 2,
          status_name: '实现中',
          color: '#2877FF',
        },
        project_category: {
          id: 499,
          name: '需求',
          attachment_path:
            'https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png',
        },
        story_config_priority: {
          id: 0,
          name: '无优先级',
          content_txt: '',
          group_content_txt: '',
        },
        handlers: [
          {
            id: 689,
            name: '蒋晓龙',
            avatar: '',
          },
          {
            id: 105,
            name: '晚风',
            avatar: '',
          },
        ],
      },
    ],
  },
  {
    id: 99,
    kanban_config_id: 1,
    name: '已完成',
    max_num: 1,
    stories: [],
  },
  {
    id: 114,
    kanban_config_id: 1,
    name: '其它状态列',
    max_num: 1,
    stories: [],
  },
]

export const kanbanInfoByGroup: Model.KanBan.Group[] = [
  {
    id: 9535,
    name: '极高',
    content: '极高',
    color: '#FF5C5E',
    icon: 'extremely-high',
    identity: 'priority',
    content_txt: '极高',
    columns: [
      {
        id: 112,
        kanban_config_id: 1,
        name: '规划中',
        max_num: 1,
        stories: [
          {
            id: 1002929,
            name: '个人中心（jxl）',
            category_id: 499,
            schedule: 0,
            priority: 9535,
            created_at: '2023-03-16 09:32:00',
            story_prefix_key: 'CSXM（JXL）-1',
            children_count: 0,
            category_status: {
              id: 1821,
              category_id: 571,
              status_id: 9540,
              is_start: 1,
              is_end: 2,
              status_name: '规划中',
              color: '#FA9746',
            },
            project_category: {
              id: 499,
              name: '需求',
              attachment_path:
                'https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png',
            },
            story_config_priority: {
              id: 9535,
              name: '极高',
              content: '极高',
              color: '#FF5C5E',
              icon: 'extremely-high',
              identity: 'priority',
              content_txt: '极高',
            },
            handlers: [
              {
                id: 689,
                name: '蒋晓龙',
                avatar: '',
              },
            ],
          },
        ],
      },
      {
        id: 99,
        kanban_config_id: 1,
        name: '已完成',
        max_num: 1,
        stories: [],
      },
      {
        id: 114,
        kanban_config_id: 1,
        name: '其它状态列',
        max_num: 1,
        stories: [],
      },
    ],
  },
  {
    id: 0,
    name: '无优先级',
    content_txt: '',
    columns: [
      {
        id: 112,
        kanban_config_id: 1,
        name: '规划中',
        max_num: 1,
        stories: [
          {
            id: 1003010,
            name: '需求测试12（jxl）',
            category_id: 571,
            schedule: 0,
            priority: 0,
            created_at: '2023-03-22 18:07:39',
            story_prefix_key: 'CSXM（JXL）-2',
            children_count: 0,
            category_status: {
              id: 1821,
              category_id: 571,
              status_id: 9540,
              is_start: 1,
              is_end: 2,
              status_name: '规划中',
              color: '#FA9746',
            },
            project_category: {
              id: 571,
              name: '测试需求类别（jx）',
              attachment_path:
                'https://dev.staryuntech.com/dev-agile/attachment/category_icon/home.png',
            },
            story_config_priority: {
              id: 0,
              name: '无优先级',
              content_txt: '',
            },
            handlers: [
              {
                id: 689,
                name: '蒋晓龙',
                avatar: '',
              },
            ],
          },
          {
            id: 1003095,
            name: '需求测试',
            category_id: 499,
            schedule: 0,
            priority: 0,
            created_at: '2023-03-24 18:52:40',
            story_prefix_key: 'CSXM（JXL）-3',
            children_count: 0,
            category_status: {
              id: 1642,
              category_id: 499,
              status_id: 9541,
              is_start: 2,
              is_end: 2,
              status_name: '实现中',
              color: '#2877FF',
            },
            project_category: {
              id: 499,
              name: '需求',
              attachment_path:
                'https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png',
            },
            story_config_priority: {
              id: 0,
              name: '无优先级',
              content_txt: '',
              group_content_txt: '',
            },
            handlers: [
              {
                id: 689,
                name: '蒋晓龙',
                avatar: '',
              },
              {
                id: 105,
                name: '晚风',
                avatar: '',
              },
            ],
          },
        ],
      },
      {
        id: 99,
        kanban_config_id: 1,
        name: '已完成',
        max_num: 1,
        stories: [],
      },
      {
        id: 114,
        kanban_config_id: 1,
        name: '其它状态列',
        max_num: 1,
        stories: [],
      },
    ],
  },
]
