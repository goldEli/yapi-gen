declare namespace API.Sprint {
  namespace GetSprintList {
    type Params = {
      project_id: number
      keyword: string
      iterate_id: number[]
      status: number[]
      priority: number[]
      user_id: number[] | number
      tag: number[]
      created_at: string
      expected_start_at: string
      expected_end_at: string
      updated_at: string
      finish_at: string
      users_name: number[]
      users_copysend_name: number[]
      parent_id: number
      all: boolean
      panel: boolean
      class_ids: number[]
      class_id: number
      category_id: number
      schedule_start: number | string
      custom_field: Model.Sprint.CustomFiledInfo
      tree: boolean | number
      top_parent_id: number
      system_view: number | string
      pageSize: number
      page: number
      orderkey: string
      order: string
    }
    type Result = {
      list: Model.Sprint.listItem[]
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
}
