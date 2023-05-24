declare namespace API.Sprint {
  namespace GetSprintList {
    type Params = {
      id: number
    }
    type Result = {
      list: Model.Sprint.Task[]
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
    type Result = Array<{ name: string; number: number; ratio: string }>
  }
}
