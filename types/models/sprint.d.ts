declare namespace Model.Sprint {
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
    child_story_count: number
    priority: number | PriorityInfo
    iterate_name: string
    status: StatusInfo
    users_name: string
    created_at: string
    expected_start_at: string
    expected_end_at: string
    info: string
    user_id: number | number[]
    iterate_id: number
    parent_id: number
    finish_at: string
    updated_at: string
    users_copysend_name: string
    user_name: number
    tag: any
    verify_lock: number
    category: string
    class: null | number
    schedule: number
    custom_field: CustomFiledInfo
    category_color: string
    category_remark: string
    category_id: number
    project_id: number
    users_name_ids: string[] | number[]
    users_copysend_name_ids: string[] | number[]
    category_attachment: string
    all_child_story_count: number
    all_child_ids: string[] | number[]
    children: null | ListItem[]
    topParentId?: number
    level: number | string
    category_config_list: CategoryConfigList
    story_prefix_key: string
    work_type: WorkType
  }
  type Visible = boolean
  interface ListItem {
    name: string
    number: number
    ratio: string
  }
  interface WorkListItem {
    completion_rate: string
    new: number
    completed: number
    total: number
    risk: number
  }
  interface DefectListItem {
    completion_rate: string
    not_fixed: number
    fixing: number
    fixed: number
    total: number
  }
}

// 1：迭代-需求类型，2：迭代-缺陷类型，3：冲刺-长故事事务类型，4：冲刺-标准事务类型，5：冲刺-故障事务类型 6-子任务
type WorkType = 1 | 2 | 3 | 4 | 5 | 6
