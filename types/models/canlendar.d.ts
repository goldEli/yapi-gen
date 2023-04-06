declare namespace Model.Calendar {
  /**
   * 可订阅人群type
   */
  type ChooseAddType = 'member' | 'team' | 'department' | undefined | 'all' | ''

  interface RouterMenu {
    name: string
    key: string
  }

  interface MemberItem {
    id: number
    name: string
    avatar?: string
    // 1是选中
    is_checked?: 0 | 1
    type?: ChooseAddType
    permission?: number
  }
  interface Info {
    id: number
    color: number
    // 1 是默认的日历，用于判断删除权限
    is_default: 0 | 1
    name: string
    // 1是选中的日历
    is_check: 0 | 1
  }

  interface CalendarData {
    manage: Info[]
    sub: Info[]
  }

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

  interface CalendarIcon {
    id: number
    path: string
  }

  /**
   * 日历面板按照不同类型展示
   */
  type CalendarPanelType = 'year' | 'day' | 'week' | 'month' | 'list'

  interface DayOfMonth {
    lunar_year_chinese: string
    lunar_month_chinese: string
    lunar_day_chinese: string
    term: string
    week_no: number
    week_name: string
    // '金牛'
    constellation: string
    is_current_month: boolean
    year: number
    month: number
    day: number
    week_num: number
    date: string
    // '2023-05-04 00:00:00'
    datetime: string
    // '2023-05-05T16:00:00.000000Z'
    date_object: string
    timestamp: number
    // 'PRC'
    timezone_name: string
  }
}
