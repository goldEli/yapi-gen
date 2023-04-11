declare namespace API.Calendar {
  namespace CalendarInfo {
    type Result = {
      id: number
      type: number
      name: string
      describe: string
      icon: string
      permission: 1 | 2 | 3
      color: number
      is_default: 1 | 2
      status: number
      subscribe_num: number
      share_members: []
      subscribe_members: []
      user: []
    }
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
