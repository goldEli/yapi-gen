declare namespace Model.KanbanConfig {
  interface ConfigListItem {
    id: number
    project_id: number
    name: string
    is_default?: 1 | 2
    check?: boolean
  }
  interface Status {
    id?: number
    // 必需 需求分类id
    story_type_id: number
    // 必需 流转状态id
    flow_status_id: number
    stories_count: number
    attachment_path?: string
    status_name: string
    is_start: 1 | 2
    status_color?: string
    is_end: 1 | 2
    kanban_column_id?: number
    can_flow_status?: number[]
    category_name: string
  }
  interface Category {
    id: number
    name: string
    attachment_id: number
    // 图片地址
    attachment_path: string
    status?: Status[]
    project_id?: number
  }
  interface Column {
    id: number
    kanban_config_id: number
    name: string
    max_num: number
    categories: Category[]
  }
  interface Config extends ConfigListItem {
    columns?: Column[]
    isSaveAs?: boolean
  }
}
