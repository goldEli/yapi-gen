declare namespace Model.Calendar {
  interface GetRelateConfigCommonInfo {
    value: number
    label: string
    describe?: string
  }

  // 日历相关下拉配置
  interface GetRelateConfig {
    calendar: {
      permission_types: GetRelateConfigCommonInfo[]
      user_group_ids: GetRelateConfigCommonInfo[]
      subscribe_types: GetRelateConfigCommonInfo[]
      calendar_types: GetRelateConfigCommonInfo[]
      icon_path: string[]
    }
    schedule: {
      permission_types: GetRelateConfigCommonInfo[]
      repeat_types: GetRelateConfigCommonInfo[]
      repeat_end_types: GetRelateConfigCommonInfo[]
      remind_types: GetRelateConfigCommonInfo[]
      all_day_remind: GetRelateConfigCommonInfo[]
      un_all_day_remind: GetRelateConfigCommonInfo[]
      default_duration: GetRelateConfigCommonInfo[]
      busy_status: GetRelateConfigCommonInfo[]
    }
  }

  // 日历设置-视图设置
  interface ViewOptionsInfo {
    hide_reject_schedule: number
    reduce_finish_schedule_light: number
    show_lunar_calendar: number
    week_first_day: number
  }
  // 日历设置-日程设置
  interface ScheduleConfigsInfo {
    schedule_color: number
    schedule_default_duration: number
  }

  // 日历设置-通知设置
  interface NotificationConfigsInfo {
    not_all_day_remind: number
    all_day_remind: number
    only_remind_accept: number
  }

  interface UpdateCalendarConfigParams {
    view_options: ViewOptionsInfo | undefined
    schedule_configs: ScheduleConfigsInfo | undefined
    notification_configs: NotificationConfigsInfo | undefined
  }

  // 创建日历弹窗传入参数
  interface ShowCalendarParams {
    // 用于编辑日历详情查询
    id?: number
  }

  // 创建日程弹窗传入参数
  interface ShowScheduleParams {
    // 用于编辑日程详情查询
    id?: string | number
    // 日程时间
    time?: {
      startTime: string
      endTime: string
    }
    // 是否全天
    isAll?: boolean
    // 小弹窗位置
    position?: { x: number; y: number }
  }

  /**
   * 可订阅人群type
   */
  type ChooseAddType = 1 | 2 | 3 | undefined | 4 | null

  /**
   * 日程设置当前选中的锚点
   */
  interface RouterMenu {
    name: string
    key: string
  }

  // 添加成员/部门/团队
  interface MemberItem {
    id: number
    name: string
    avatar?: string
    // 1是选中
    is_checked?: 1 | 2
    type?: ChooseAddType
    permission?: number
    is_owner?: 1 | 2
  }
  // 日历列表返回数据
  interface Info {
    calendar_id: number
    id: number
    color: number
    is_owner: 1 | 2
    // 1 是默认的日历，用于判断删除权限
    is_default: 0 | 1
    name: string
    // 1是选中的日历
    is_check?: 0 | 1
    user_group_id: 1 | 2 | 3 | 4
    user: {
      id: number
      name: string
    }
  }

  // 订阅日历数据 我管理的和我订阅的
  interface CalendarData {
    manager: Info[]
    subscribe: Info[]
  }

  // 订阅列表数据 节假日、公开日历、订阅联系人
  interface SubscribeInfo {
    id: number
    avatar?: string
    name: string
    phone?: string
    email?: string
    // 1是订阅
    is_subscribe: 0 | 1
    department?: string
    creator?: string
    number?: number | string
    describe?: string
    icon?: string
  }

  // 日历图标列表
  interface CalendarIcon {
    id: number
    path: string
  }

  /**
   * 日历面板按照不同类型展示
   */
  type CalendarPanelType = 'year' | 'day' | 'week' | 'month' | 'list'
  // 1下一年  -1上一年 0 当前年份
  type CalendarYearType = -1 | 0 | 1

  interface DaysOfWeek {
    // 必须 农历月
    lunar_month_chinese: string
    // 必须 农历日
    lunar_day_chinese: string
    // 必须 节日
    term: string
    // 必须 周索引，0-6分别是周日到周六
    week_no: 0 | 1 | 2 | 3 | 4 | 5 | 6
    // 必须 周名称
    week_name: string
    // 必须 星座
    constellation: string
    // 必须 是否是当前月
    is_current_month: boolean
    // 必须 年
    year: number
    month: number
    day: number
    week_num: number
    date: string
    datetime: string
    date_object: string
    timestamp: number
    timezone_name: string
  }
  interface DaysOfMonth {
    // 必须 农历月
    lunar_month_chinese: string
    // 必须 农历日
    lunar_day_chinese: string
    // 必须 节日
    term: string
    // 必须 周索引，0-6分别是周日到周六
    week_no: 0 | 1 | 2 | 3 | 4 | 5 | 6
    // 必须 周名称
    week_name: string
    // 必须 星座
    constellation: string
    // 必须 是否是当前月
    is_current_month: boolean
    // 必须 年
    year: number
    month: number
    day: number
    week_num: number
    date: string
    datetime: string
    date_object: string
    timestamp: number
    timezone_name: string
  }
}
