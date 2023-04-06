declare namespace Model.Calendar {
  /**
   * 可订阅人群type
   */
  type ChooseAddType = 'member' | 'team' | 'department' | undefined | 'all' | ''

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
    color: string
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
  type CalendarYearType = -1 | 0 | 1 // 1下一年  -1上一年 0 当前年份
}
