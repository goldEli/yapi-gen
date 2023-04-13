declare namespace API.Schedule {
  namespace ModifySchedule {
    type Keys =
      | 'calender_id'
      | 'schedule_id'
      | 'subject'
      | 'start_datetime'
      | 'start_datetime'
      | 'color'
    type Params = Omit<Partial<Model.Schedule.Info>, Keys> &
      Required<Pick<Model.Schedule.Info, Keys>>
    type Result = null
  }

  type ScheduleListResult = {
    [key in string]: Model.Schedule.Info[]
  }
  type CalendarIds = {
    calendar_ids: number[]
  }
  namespace GetScheduleListDaysOfDate {
    type Params = {
      date: string
    } & CalendarIds
    type Result = ScheduleListResult
  }

  namespace GetScheduleListDaysOfMonth {
    type Params = {
      year: number
      month: number
    } & CalendarIds
    type Result = ScheduleListResult
  }

  namespace GetScheduleListDaysOfWeek {
    type Params = {
      year: number
      week: number
    } & CalendarIds
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
