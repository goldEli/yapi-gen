export const columnsFromBackend: Model.SprintKanBan.IssuesGroup[] = [
  {
    groupId: 1,
    title: '美术组',
    data: [
      {
        id: 1,
        title: '规划中',
        count: 9,
        list: [
          {
            id: 1111,
            name: '吃饭',
            father_id: 1,
            status_id: 2222,
          },
          {
            id: 2222,
            name: '睡觉',
            father_id: 1,
            status_id: 2222,
          },
          {
            id: 3333,
            name: '看书',
            father_id: 1,
            status_id: 2222,
          },
        ],
      },
      { id: 2, title: '实现中', count: 9, list: [] },
      { id: 3, title: '已完成', count: 9, list: [] },
    ],
  },
  {
    groupId: 2,
    title: '程序组',
    data: [
      { id: 1, title: '规划中', count: 9, list: [] },
      {
        id: 2,
        title: '实现中',
        count: 9,
        list: [
          {
            id: 4444,
            name: '去上幼儿园',
            father_id: 2,
            status_id: 1111,
          },
          {
            id: 5555,
            name: '去商场买衣服',
            father_id: 2,
            status_id: 1111,
          },
          {
            id: 6666,
            name: '回家洗衣服',
            father_id: 2,
            status_id: 1111,
          },
        ],
      },
      { id: 3, title: '已完成', count: 9, list: [] },
    ],
  },
]

export const issueColumns: Model.SprintKanBan.IssueColumn[] = [
  { id: 1, title: '规划中', deps: [{ id: 2222, title: '规划中', to: [1111] }] },
  {
    id: 2,
    title: '实现中',
    deps: [
      {
        id: 1111,
        title: '原画',
      },
    ],
  },
  { id: 3, title: '已完成' },
]
