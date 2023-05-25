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
  }
  interface StoryConfigPriority {
    id: number
    name: string
    // 翻译
    content_txt: string
    content?: string
    group_content_txt?: string
    color?: string
    // #FF5C5Eextremely-high --function-tag3
    // #FA9746high           --function-tag4
    // #2877FFmiddle         --function-tag5
    // #43BA9Alow            --function-tag2
    // #BBBDBFextremely-low  --function-tag6
    icon?: 'extremely-high' | 'high' | 'middle' | 'low' | 'extremely-low'
    identity?: string
  }
  interface Handler {
    id: number
    name: string
    avatar: string
  }
  interface Group {
    id: number
    name: string
    content_txt: string
    content?: string
    color?: string
    icon?: string
    identity?: string
    columns: Column[]
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
    project_category: ProjectCategory
    story_config_priority: StoryConfigPriority
    handlers: Handler[]
  }
  type Column = Omit<Model.KanbanConfig.Column, 'categories'> & {
    stories: Story[]
  }

  interface ViewItem {
    key: string
    value: string
    check: boolean
    isDefault?: boolean
    operation?: boolean
  }

  type guideVisible = boolean
  interface GroupInfoItem {
    key: 'none' | GroupType
    value: string
    check: boolean
  }
}
