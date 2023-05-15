declare namespace API.Sprint {
  namespace GetSprintList {
    type Params = {
      id: number
    }
    type Result = {
      list: Model.Sprint.Task[]
    }
  }
}
