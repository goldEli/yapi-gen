declare namespace API.Sprint {
  namespace GetSprintKanBanList {
    type Params = {
      id: number
    }
    type Result = {
      list: Model.SprintKanBan.Task[]
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
      project_ids?: string
      iterate_ids?: string
      user_ids?: string
      start_time?: string
      end_time?: string
      sort?: string
    }
    type Result = Array<{
      user_name: string
      completion_rate: string
      work_total: number
    }>
  }
  namespace GetDefectRatio {
    type Params = {
      project_ids?: string
      user_ids?: string
      iterate_ids?: string
      start_time?: string
      end_time?: string
      iterate_ids?: string
      sort?: string
      dimension?: string
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
    type Params = {
      project_ids: Array<number>
      iterate_ids: Array<number>
      user_ids: Array<number>
      user_ids?: number
      start_time: string
      end_time: string
      period_time?: string
    }
    type Result = {
      work: Array<Model.Sprint.WorkListItem>
      defect: Array<Model.Sprint.DefectListItem>
    }
  }
  namespace WorkContrastList {
    type Params = {
      project_ids?: string
      iterate_ids?: string
      user_ids?: string
      period_time?: string
      start_time?: string
      end_time?: string
      page: 1
      pagesize: 20
    }
    type Result = {
      work: Array<Model.Sprint.WorkListItem>
      list: Array<Model.Sprint.WorkDataListItem>
      pager: {
        total: number
        page: number
        pagesize: number
      }
    }
  }
  namespace MemberBugList {
    type Params = {
      project_ids?: string
      user_ids?: string
      start_time: string
      end_time: string
      iterate_ids?: string
      period_time?: string
      two_week?: string
      page: number

      pagesize: number
    }
    type Result = {
      defect: Array<Model.Sprint.WorkListItem>
      list: Array<Model.Sprint.BugDataListItem>
      pager: {
        total: number
        page: number
        pagesize: number
      }
    }
  }
  namespace PlugSelectionUserInfo {
    type Result = {
      userInfo: Model.Sprint.UserInfo2
      status: Array<Model.Sprint.StatusInfo2>
    }
  }
  namespace EfficiencyMemberWorkList {
    type Params = { user_id: number; type: string; status_id?: number }
    type Result = {
      total: Model.Sprint.Total
      list: Array<Model.Sprint.List>
    }
  }
  namespace CheckUpdate {
    type Params = {
      id: number
      config: any
    }
  }
  namespace SprintGroupList {
    type Params = {
      order: string
      orderkey: string
      search: {
        all: number
        project_id: number
        id?: number[]
        user_id?: number[]
        category_id?: number[]
        story_name?: string
      }
      is_long_story: number
    }
  }

  namespace SprintList {
    type Params = {
      order: string
      orderkey: string
      search: {
        all: number
        project_id: number
        sprint_status: number
      }
      is_long_story: number
    }
  }

  namespace CreateSprint {
    type Params = {
      project_id: number
      name: string
      info?: string
      start_at: any
      end_at: any
      duration: {
        is_weekend: number
        week_type: number
      }
    }
  }

  namespace GetSprintDetail {
    type Params = {
      project_id: number
      id: number
    }
  }
  namespace UpdateSprintInfo {
    type Params = {
      project_id: number
      id: number
      name: string
      info?: string
      start_at: any
      end_at: any
      duration: {
        is_weekend: number
        week_type: number
      }
    }
  }
  namespace DelSprintItem {
    type Params = {
      id: number
      project_id: number
    }
  }

  namespace CompleteSprint {
    type Params = {
      project_id: number
      id: number
      finish_at: string
      result?: string | undefined
      move_type: number
      move_target: number
    }
  }

  namespace MoveStory {
    type Params = {
      iterate_id: number
      story_id: number
      to_iterate_id: number
      project_id: number
    }
  }
  namespace GetLongStory {
    type Params = {
      order: string
      orderkey: string
      search: {
        all: number
        project_id: number
        keyword?: string
      }
      page?: number
      pagesize?: number
    }
  }

  namespace SortStory {
    type Params = {
      iterate_id: number
      story_ids: number[]
      project_id: number
    }
  }
}
