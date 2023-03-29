declare namespace API.Calendar {
  namespace GetCalendarList {
    type Result = {
      manage: Model.Calendar.Info[]
      sub: Model.Calendar.Info[]
    }
  }
}
