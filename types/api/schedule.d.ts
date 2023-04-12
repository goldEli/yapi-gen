declare namespace API.Schedule {
  namespace GetScheduleList {
    type Params = {
      id: number
    }
    type Result = {
      [key in string]: Model.Schedule.Info[]
    }
  }
  namespace SaveSchedule {
    type Params = Model.Schedule.Info
    type Result = {
      [key in string]: Model.Schedule.Info[]
    }
  }
  namespace ScheduleInfoList {
    type Params = {
      [key, index]: number
      calendar_ids: number[]
    }
    type Result = {
      [key in string]: Model.Schedule.Info[]
    }
  }

  namespace
}
