declare namespace API.Sprint {
  namespace UpdateSprintCategory {
    type Params = {
      projectId: number
      sprintId?: number
      categoryId: number
      statusId: number
    }
  }
  namespace UpdateSprintPriority {
    type Params = {
      projectId: number
      sprintId?: number
      priorityId: number
    }
  }
  namespace AddInfoSprint {
    type Params = {
      projectId: number
      sprintId?: number
      targetId: Model.Sprint.AttachTarget[] | { name: string; color: string }[]
      type: string
    }
  }

  namespace GetSprintStatusLog {
    type Params = {
      projectId: number
      sprintId: number
      all: boolean
    }
  }
  namespace GetSprintChangeLog {
    type Params = {
      projectId: number
      sprintId: number
      pageSize: number
      page: number
      orderKey: string
      order: string
    }
    type Result = {
      pager?: {
        page: number
        pagesize: number
        total: number
      }
      list: Model.Sprint.SprintChangeLogResultInfo[]
    }
  }

  namespace AddSprintComment {
    type Params = {
      projectId: number
      sprintId: number
      content: string
      attachment?: Model.Sprint.AddSprintCommentAttach[]
      a_user_ids?: (string | null)[]
    }
  }

  namespace DeleteSprintComment {
    type Params = {
      projectId: number
      id: number
    }
  }
  namespace GetSprintKanBanList {
    type Params = {
      id: number
    }
    type Result = {
      list: Model.SprintKanBan.Task[]
    }
  }
  namespace GetSprintList {
    type Params = {
      projectId: number
      searchValue: string
      iterateIds: number[]
      statusIds: number[]
      priorityIds: number[]
      userId: number[] | number
      tagIds: number[]
      startTime: string
      expectedStart: string
      expectedEnd: string
      updatedTime: string
      endTime: string
      usersNameId: number[]
      copySendId: number[]
      parentId: number
      all: boolean
      panel: boolean
      class_ids: number[]
      class_id: number
      category_id: number
      schedule_start: number | string
      schedule_end: number | string
      custom_field: Model.Sprint.CustomFiledInfo
      tree: boolean | number
      topParentId: number
      system_view: number | string
      pageSize: number
      page: number
      orderKey: string
      order: string
      isChildren?: boolean
      usersInfo: Model.Sprint.ListUsersInfo[]
    }
    type SelectResult = Model.Sprint.ListItem[]
    type Result = {
      pager?: {
        page: number
        pagesize: number
        total: number
      }
      list: Model.Sprint.ListItem[]
    }
  }

  namespace GetSprintInfo {
    type Params = {
      projectId: number
      sprintId?: number
    }

    type Result = Model.Sprint.SprintInfoResult
  }

  namespace GetSprintCommentList {
    type Params = {
      sprintId: number
      projectId: number
      page: number
      pageSize: number
    }
    type Result = {
      a_user_ids: number[]
      app_attachment: Model.Sprint.ListItemUserOrAttach[]
      avatar: string
      content: string
      created_at: string
      id: number
      name: string
      status: number
      status_content: string
      story_id: number
      updated_at: string
      user_id: number
    }
  }
  namespace GetSprintIssueList {
    type Data = {
      title: string
      items: Model.SprintKanBan.Issue[]
    }
    type Keys = 'todo' | 'inProgress' | 'done'
    type Result = {
      data: Model.SprintKanBan.Issues[]
    }
  }
  namespace GetProjectRoleList {
    type Params = {
      project_id: number
    }
    type Result = Model.Sprint.ProjectSettings[]
    type updateParams = {
      user_group_id: number
      project_id: number
      user_id: number
    }
  }
  namespace UpdateHomeSetting {
    type Params = {
      id: number
      default_home_menu: string
    }
    type Result = {
      data: boolean
    }
  }
  namespace GetCompletionRate {
    type Params = {
      project_id: string
      user_ids: Array<number>
      start_time: string
      end_time: string
      sort: string
    }
    type Result = Array<{
      user_name: string
      completion_rate: string
      work_total: number
    }>
  }
  namespace GetDefectRatio {
    type Params = {
      project_id: string
      user_ids: Array<number>
      start_time: string
      end_time: string
      sort: string
      dimension: string
    }
    type Result = Array<{ name: string; number: number; ratio: string }>
  }
  namespace GetBugList {
    type Params = {
      project_id: string
      user_ids: Array<number>
      start_time: string
      end_time: string
    }
    type Result = Model.Sprint.ListItem[]
  }
  namespace GetStatisticsTotal {
    type Result = {
      work: Model.Sprint.WorkListItem
      defect: Model.Sprint.DefectListItem
    }
  }
}
