declare namespace API.Schedule {
  type ScheduleListResult = {
    [key in string]: Model.Schedule.Info[]
  }
  namespace GetScheduleListDay {
    type Params = {
      day: string
      calendar_ids: number[]
    }
    type Result = ScheduleListResult
  }

  namespace GetScheduleListDaysOfMonth {
    type Params = {
      year: number
      month: number
      calendar_ids: number[]
    }
    type Result = ScheduleListResult
  }

  namespace GetScheduleListDaysOfWeek {
    type Params = {
      year: number
      week: number
      calendar_ids: number[]
    }
    type Result = ScheduleListResult
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
