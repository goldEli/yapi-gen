declare namespace API.Calendar {
  namespace GetCalendarList {
    type Result = {
      manage: Model.Calendar.Info[]
      sub: Model.Calendar.Info[]
    }
  }

  namespace GetSubscribeList {
    type Params = {
      type: string
    }
    type Result = {
      list: Model.Calendar.SubscribeInfo[]
    }
  }
}
