declare namespace API.Schedule {
  namespace GetScheduleInfo {
    type Params = {
      id: number | string
      show_date?: number | string
    }

    type Result = Model.Schedule.DetailInfo
  }
  namespace ModifySchedule {
    type Keys =
      | 'calendar_id'
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
      // year: number
      // week: number,
      date: number | string
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

  namespace SearchKeys {
    type params = {
      calendar_ids: number[]
      year: number
      keyword?: string
    }
  }
  namespace Reply {
    type params = { id: number | string; status: number }
  }
  namespace Transfer {
    type params = { id: string; is_exit: number; user_id: number }
  }
  namespace Delete {
    type params = { id: string; is_remind: boolean }
  }
}
