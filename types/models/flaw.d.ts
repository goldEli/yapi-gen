declare namespace Model.Flaw {
  // 1：关联、2：前置、3：后置、4：阻塞，5：被阻塞
  type RelationType = 1 | 2 | 3 | 4 | 5

  interface FlawRelationStoriesData {
    pager: {
      page: number
      pagesize: number
      total: number
    }
    list: FlawRelationStoriesInfo[]
  }

  interface FlawRelationStoriesInfo {
    id: number
    name: string
    category_status_id: number
    category_id: number
    schedule: number
    priority: number | PriorityInfo
    created_at: string
    story_prefix_key: string
    children_count: number
    categoryConfigList: any
    category_config_list: any
    category_status: {
      id: number
      category_id: number
      status_id: number
      is_start: number
      is_end: number
      status_name: string
      color: string
    }
    project_category: {
      id: number
      name: string
      attachment_path: string
    }
    story_config_priority: {
      id: number
      name: string
      content: string
      color: string
      icon: string
      identity: string
      content_txt: string
      group_content_txt: string
    }
    handlers: {
      id: number
      name: string
      avatar: string
    }[]
    pivot?: {
      type: RelationType
      sort: number
    }
    relation_type: number
  }

  interface FlawInfo {
    id: number
    name: string
    category_status_id: number
    category_id: number
    schedule: number
    priority: number | PriorityInfo
    created_at: string
    story_prefix_key: string
    children_count: number
    category_status: {
      id: number
      category_id: number
      status_id: number
      is_start: number
      is_end: number
      status_name: string
      color: string
    }
    project_category: {
      id: number
      name: string
      attachment_path: string
    }
    story_config_priority: {
      id: number
      name: string
      content: string
      color: string
      icon: string
      identity: string
      content_txt: string
      group_content_txt: string
    }
    handlers: {
      id: number
      name: string
      avatar: string
    }[]
    pivot?: {
      type: RelationType
      sort: number
    }
    has_verify: number
    verify_data: any
  }
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
  interface FlawChangeLogResultInfo {
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

  interface FlawChangeLogInfo {
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
  interface AddFlawCommentAttach {
    url: string
    ctime: string
    username: string
    name: string
    ext: string
    size: number
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
    attachment: Model.Flaw.ListItemUserOrAttach[]
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

  interface Severity {
    id: number
    content: string
    sort: number
    color: string
    icon: string
    identity: string
    content_txt: string
    group_content_txt: string
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
    project_type: 1 | 2
    severity: Severity
    discovery_version_name: string
    discovery_version: null | number
    solution: string
  }

  interface ChildStoryStatistics {
    finish_count: number
    finish_percent: number
    processing_count: number
    processing_percent: number
    start_count: number
    start_percent: number
    total_count: number
  }

  interface FlawInfo {
    category_attachment: string
    id: number
    name: string
    info: string
    priority: PriorityInfo | number | undefined
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
    child_story_statistics: ChildStoryStatistics
    project_type: 1 | 2
    severity: Severity
    discovery_version_name: string
    discovery_version: null | number
    solution: string
    is_bug: 1 | 2
    update_at: string
  }

  interface FlawInfoResult {
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
    child_story_statistics: ChildStoryStatistics
    project_type: 1 | 2
    severity: Severity
    discovery_version_name: string
    discovery_version: null | number
    solution: string
    is_bug: 1 | 2
    update_at: string
    has_verify: number
    verify_data: any
  }

  // 1：迭代-需求类型，2：迭代-缺陷类型，3：冲刺-长故事事务类型，4：冲刺-标准事务类型，5：冲刺-故障事务类型 6-子任务
  type WorkType = 1 | 2 | 3 | 4 | 5 | 6
}
