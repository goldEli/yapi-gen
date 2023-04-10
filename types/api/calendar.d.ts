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
      }
    }
  }

  namespace AddCalendar {
    type Params = {
      name: string
      describe?: string
      icon: string
      permission: 1 | 2 | 3
      color: number
      share_members: { user_id: number; user_group_id: 1 | 2 | 3 | 4 }[]
      subscribe_members: { object_id: number; object_type: 1 | 2 | 3 | 4 }[]
    }
    type Result = {
      id: number
    }
  }
}
