declare namespace API.Sprint {
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
