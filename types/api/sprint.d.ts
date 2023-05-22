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
  namespace GetProjectRoleList{
    type Params={
      project_id:number
    }
    type Result=Model.Sprint.ProjectSettings[]
    type updateParams={
      user_group_id:number,
      project_id:number,
      user_id:number
    }
  }
}
