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
}
