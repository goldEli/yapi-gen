declare namespace API.Calendar {
  namespace GetContactsCalendarList {
    type Params = {
      username?: string
      page: number
    }
    type Result = {
      list: Model.Calendar.GetContactsCalendarInfo[]
      pager: Model.Calendar.Pager
    }
  }

  namespace UserSetupsCalendar {
    type Params = {
      id: number
      color?: number
      is_check?: 1 | 2
      is_only_show?: 1
    }
  }
  namespace GetDaysOfWeekList {
    type Params = {
      // week: number
      // year: number
      date: number | string
    }
    type Result = Model.Calendar.DaysOfWeek[]
  }
  namespace GetDaysOfMonthList {
    type Params = {
      month: number
      year: number
    }
    type Result = Model.Calendar.DaysOfWeek[]
  }
  namespace CalendarInfo {
    type Result = Model.Calendar.CalendarInfo
  }

  namespace GetCalendarList {
    type Result = {
      manager: Model.Calendar.Info[]
      subscribe: Model.Calendar.Info[]
    }
  }

  namespace GetSubscribeList {
    type Params = {
      type: string
      keywords?: string
      page: number
    }
    type Result = {
      list: Model.Calendar.SubscribeInfo[]
      pager: Model.Calendar.Pager
    }
  }

  namespace GetCalendarIconList {
    type Result = {
      list: Model.Calendar.CalendarIcon[]
    }
  }

  namespace GetCalendarConfig {
    type Result = {
      view_options: Model.Calendar.ViewOptionsInfo
      schedule_configs: Model.Calendar.ScheduleConfigsInfo
      notification_configs: Model.Calendar.NotificationConfigsInfo
    }
  }

  namespace GetRelateConfig {
    type Result = {
      calendar: {
        permission_types: GetRelateConfigCommonInfo
        user_group_ids: GetRelateConfigCommonInfo
        subscribe_types: GetRelateConfigCommonInfo
        calendar_types: GetRelateConfigCommonInfo
        icon_path: string[]
      }
      schedule: {
        permission_types: GetRelateConfigCommonInfo
        repeat_types: GetRelateConfigCommonInfo
        repeat_end_types: GetRelateConfigCommonInfo
        remind_types: GetRelateConfigCommonInfo
        all_day_remind: GetRelateConfigCommonInfo
        un_all_day_remind: GetRelateConfigCommonInfo
        default_duration: GetRelateConfigCommonInfo
        busy_status: GetRelateConfigCommonInfo
      }
    }
  }

  namespace AddCalendar {
    type Params = {
      id?: number
      name: string
      describe?: string
      icon: string
      permission: 1 | 2 | 3
      color: number
      share_members: {
        user_id: number
        user_group_id: 1 | 2 | 3 | 4
        is_owner: 1 | 2
      }[]
      subscribe_members: { object_id: number; object_type: 1 | 2 | 3 | 4 }[]
    }
    type Result = {
      id: number
    }
  }
}
