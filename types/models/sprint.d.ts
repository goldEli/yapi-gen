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

  // 列表用户
  interface UserInfo {
    account_id: number
    avatar: string
    come_from: number
    company_id: number
    created_at: string
    department_id: number
    email: string
    gender: number
    handover_status: number
    id: number
    is_super_admin: number
    job_id: number
    name: string
    nickname: string
    project_num: number
    status: number
    updated_at: string
    user_group_id: number
  }

  type Visible = boolean
  interface ListItem {
    name: string
    number: number
    ratio: string
  }
  interface WorkListItem {
    name: string
    value: number
    unit: string
    icon?: string
  }
  interface DefectListItem {
    name: string
    value: number
    unit: string
    icon?: string
  }

  interface BugDataListItem {
    id: number
    userName: string
    departmentName: string
    positionName: string
    completion_rate: string
    not_fixed: number
    fixing: number
    fixed: number
    repeat_open_rate: string
    stock_risk: number
  }
  interface WorkDataListItem {
    id: number
    userName: string
    departmentName: string
    positionName: string
    completion_rate: string
    new: number
    completed: number
    work_stock: number
    work_progress: string
    repeat_rate: string
    risk: number
  }
  interface UserItem {
    id: number
    name: string
    department_id: number
    job_id: number
    avatar: string
    department: {
      id: number
      name: string
    }
    position: {
      id: number
      name: string
    }
  }
  interface UserInfo2 {
    id: number
    name: string
    avatar: string
    email: string
    departments: Array<{
      name: string
      id: number
    }>
    position: {
      name: string
      id: number
    }
  }
  interface StatusInfo1 {
    value: number
    label: string
  }
  interface StatusInfo2 {
    content: string
    id: number
  }
  interface Total {
    name: string
    value: number
    unit: string
  }
  interface List {
    id: number
    name: string
    created_at: string | undefined
    story_prefix_key: string | undefined
    category_attachment: string
    expected_start_at: string | undefined
    expected_end_at: string | undefined
    status: number
    user: { name: string; avatar: string; id: number }
    relate_users: Array<{ name: string; avatar: string; id: number }>
  }
  interface longStroyItem {
    id: number
    name: string
    category_attachment: string
    category_id: string
    story_prefix_key: string
    project_id: number
  }
  interface pageType {
    page: number
    pagesize: number
    total: number
  }
  interface LongStory {
    list: longStroyItem[]
    pager?: pageType
  }
  interface SprintleftList {
    child_story_total: number
    end_at: string
    id: number
    iterate_id: number
    name: string
    project_id: number
    start_at: string
    status: null
    story_count: number
    story_finish_count: number
  }
  interface RecentCreateDataItem {
    name: string
    id: number
    key: number
    start_at: string
    end_at: string
  }
  interface GetMoveToList {
    name: string
    id: number
  }
}
