declare namespace Model.KanBan {
  interface CategoryStatus {
    id: number
    category_id: number
    status_id: number
    is_start: number
    is_end: number
    status_name: string
  }
  interface ProjectCategory {
    id: number
    name: string
    attachment_path: string
  }
  interface StoryConfigPriority {
    id: number
    name: string
    content_txt: string
    group_content_txt: string
  }
  interface Handler {
    id: number
    name: string
    avatar: string
  }
  interface Group {
    id: number
    name: string
    content: string
    color: string
    icon: string
    identity: string
    content_txt: string
    columns: Column[]
  }
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
  export type Column = Omit<Model.KanbanConfig.Column, 'categories'> & {
    Stories: Story[]
  }
}
