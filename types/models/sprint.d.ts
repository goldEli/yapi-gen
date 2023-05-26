declare namespace Model.Sprint {
  interface ListUsersInfo {
    avatar: string
    email: string
    gender: number
    id: number
    name: string
    nickname: string
  }
  interface AttachTarget {
    url: string
    name: string
    size: number
    ext: string
    ctime: string
  }
  interface SprintChangeLogResultInfo {
    id: number
    fields: CustomFiledInfo
    user_name: string
    created_at: string
    change_log_type: {
      content: string
      content_txt: string
      group_content_txt: string
      id: number
      identity: string
      sort: number
    }
    before: CustomFiledInfo
    after: CustomFiledInfo
  }

  interface SprintChangeLogInfo {
    id: number
    fields: CustomFiledInfo
    userName: string
    updateTime: string
    type: {
      content: string
      content_txt: string
      group_content_txt: string
      id: number
      identity: string
      sort: number
    }
    beforeField: CustomFiledInfo
    afterField: CustomFiledInfo
  }
  interface AddSprintCommentAttach {
    url: string
    ctime: string
    username: string
    name: string
    ext: string
    size: number
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

  interface CommentListInfo {
    id: number
    name: string
    content: string
    avatar: string
    createdTime: string
    statusContent: string
    userId: number
    attachment: Model.Sprint.ListItemUserOrAttach[]
  }
  // 状态
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

  // 附件信息
  interface AttachmentInfo {
    company_id: number
    created_at: string
    domain: string
    ext: string
    from: number
    id: number
    name: string
    path: string
    remarks: null | string
    size: number
    status: number
    unique_code: string
    updated_at: string
  }

  interface Tag {
    can_changes: string
    color: string
    company_id: number
    content: string
    content_txt: string
    created_at: string
    field_content: []
    group_content_txt: string
    group_key: number
    group_name: string
    icon: string
    id: number
    identity: string
    is_customize: number
    is_default_display: number
    is_default_filter: number
    is_display: number
    is_filter: number
    is_manage_by_category: number
    project_id: number
    remarks: string
    sort: number
    status: number
    title: string
    updated_at: string
  }

  interface ListItemUserOrAttach {
    company_id: number
    created_at: string
    id: number
    identity: string
    obj_content: string
    obj_id: number
    status: number
    story_id: number
    story_status: number
    updated_at: string
    user_id: number
    user_name: string
    user?: UserInfo
    attachment?: AttachmentInfo[]
    tag?: Tag[]
  }

  interface Hierarchy {
    id: number
    category_id: number
    prefix_key: number
    project_prefix: string
    category_attachment: string
    parent_id: number
    name: string
    work_type: WorkType
    attachment_id: number
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
    tag: ListItemUserOrAttach[]
    verify_lock: number
    category: string | number
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

  interface SprintInfo {
    category_attachment: string
    id: number
    name: string
    info: string
    priority: PriorityInfo | number
    expectedStart: string
    expectedEnd: string
    finishTime: string
    demandCount?: number
    iterateName: string
    userName: number
    childCount: number
    parentName?: string
    attachment?: ListItemUserOrAttach[]
    tag: ListItemUserOrAttach[]
    copySend?: string | ListItemUserOrAttach[]
    user: string | ListItemUserOrAttach[]
    createdTime: string
    status: StatusInfo
    parentId?: number | null
    changeCount?: number
    iterateId?: number | null
    projectId: number
    isExamine: boolean
    customField: CustomFiledInfo
    schedule: number
    category: string | number
    class: number | null
    className: null | number
    prefixKey?: number
    projectPrefix?: string
    hierarchy?: Hierarchy[]
    level_tree?: Hierarchy[]
    categoryName: string | number
  }

  interface SprintInfoResult {
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
    tag: ListItemUserOrAttach[]
    verify_lock: number
    category: string | number
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
    story_count?: number
    parent_name?: string
    app_changelog_count?: number
    class_id?: number
    prefix_key?: number
    project_prefix?: string
    user?: ListItemUserOrAttach[] | string
    copysend?: ListItemUserOrAttach[] | string
    attachment?: ListItemUserOrAttach[]
    hierarchy?: Hierarchy[]
    level_tree?: Hierarchy[]
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
  interface UserInfo1 {
    id: number
    name: string
    avatar: string
    departmentName: string
    positionName: string
  }
  interface UserInfo2 {
    id: number
    name: string
    avatar: string
    department: {
      name: string
    }
    position: {
      name: string
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
}

// 1：迭代-需求类型，2：迭代-缺陷类型，3：冲刺-长故事事务类型，4：冲刺-标准事务类型，5：冲刺-故障事务类型 6-子任务
type WorkType = 1 | 2 | 3 | 4 | 5 | 6
