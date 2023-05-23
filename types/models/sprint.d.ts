declare namespace Model.Sprint {
  interface CustomFiledInfo {
    [key in string]: string | number | string[] | number[]
  }
  interface SprintTableData {
    id: string
    list: any[]
  }
  interface ProjectSettings {
    id: number
    name: string
    type: number
    content_txt: string
  }
  // 优先级
  interface PriorityInfo {
    color: string
    content: string
    content_txt: string
    group_content_txt: string
    icon: string
    id: number
    identity: string
    sort: number
  }
  interface StatusInfo {
    category_id: number
    id: number
    is_start: number
    is_end: number
    project_id: number
    status_id: number
    status: {
      color: string
      company_id: number
      content: string
      content_txt: string
      group_content_txt: string
      id: number
    }
  }
  interface CategoryConfigList {
    class_id: number
    copysend: number
    created_at: number
    expected_end_at: number
    expected_start_at: number
    finish_at: number
    parent_id: number
    priority: number
    schedule: number
    user_name: number
    users: number
  }
  interface CustomFiledInfo {
    [key in string]: string | number | string[] | number[]
  }
  interface ListItem {
    id: number
    name: string
    demand: number
    priority: number | PriorityInfo
    iteration: string
    status: StatusInfo
    dealName: string
    time: string
    expectedStart: string
    expectedEnd: string
    info: string
    userIds: number | number[]
    iterateId: number
    parentId: number
    finishTime: string
    updatedTime: string
    usersCopySendName: string
    userName: number
    tag: any
    isExamine: number
    category: string
    class: null | number
    schedule: number
    custom_field: CustomFiledInfo
    categoryColor: string
    categoryRemark: string
    categoryId: number
    project_id: number
    usersNameIds: string[] | number[]
    usersCopySendIds: string[] | number[]
    category_attachment: string
    allChildrenCount: number
    allChildrenIds: string[] | number[]
    children: null | ListItem[]
    isExpended?: boolean
    level: number | string
    topId: number
    categoryConfigList: CategoryConfigList
    storyPrefixKey: string
  }
  type Visible = boolean
}
