declare namespace Model.KanBan {
  interface CategoryStatus {
    id: number
    category_id: number
    status_id: number
    is_start: number
    is_end: number
    status_name: string
    color: string
  }
  interface ProjectCategory {
    id: number
    name: string
    attachment_path: string
    work_type: 1 | 2 | 3 | 4 | 5 | 6
  }
  // #FF5C5Eextremely-high --function-tag3
  // #FA9746high           --function-tag4
  // #2877FFmiddle         --function-tag5
  // #43BA9Alow            --function-tag2
  // #BBBDBFextremely-low  --function-tag6
  type IconType = 'extremely-high' | 'high' | 'middle' | 'low' | 'extremely-low'
  interface StoryConfigPriority {
    id: number
    name: string
    // 翻译
    content_txt: string
    content?: string
    group_content_txt?: string
    color?: string
    icon?: IconType
    identity?: string
  }
  interface Handler {
    id: number
    name: string
    avatar: string
  }
  interface User {
    id: number
    name: string
    avatar?: string
  }
  interface Group {
    id: number
    name: string
    content_txt: string
    content?: string
    color?: string
    icon?: IconType
    attachment_path?: string
    identity?: string
    columns: Column[]
    users?: User[]
  }
  // 分组类型，users:用户分组，priority：优先级，category：类别
  type GroupType = 'users' | 'priority' | 'category'
  interface Story {
    id: number
    name: string
    category_id: number
    schedule: number
    priority: number
    created_at: string
    story_prefix_key: string
    children_count: number
    category_status: CategoryStatus
    category_status_id: number
    project_category: ProjectCategory
    story_config_priority: StoryConfigPriority
    handlers: Handler[]
    // 1 不能操作 2 可以操作
    verify_lock: 1 | 2
  }
  type Column = Omit<Model.KanbanConfig.Column, 'categories'> & {
    stories: Story[]
  }
  interface ViewItemConfig {
    // [key in string]: any
    // sort: { schedule: string }
    // fields: string[]
    search: {
      [key in string]: string | number
    }
  }

  interface ViewItem {
    id: number
    name: string
    check: boolean
    isDefault?: boolean
    operation?: boolean
    // 类型，1：个人视图，2：系统视图
    type: 1 | 2
    // 视图状态，1：正常，2：禁用
    status: 1 | 2
    // 视图配置
    config?: any
  }

  type guideVisible = boolean
  interface GroupInfoItem {
    key: 'none' | GroupType
    value: string
    check: boolean
  }
}
