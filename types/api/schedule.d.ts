declare namespace API.Schedule {
  namespace GetScheduleList {
    type Params = {
      id: number
    }
    type Result = {
      list: Model.Schedule.Info[]
    }
  }
}
