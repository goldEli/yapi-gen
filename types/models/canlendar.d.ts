declare namespace Model.Calendar {
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

  /**
   * 日历面板按照不同类型展示
   */
  type CalendarPanelType = 'year' | 'day' | 'week' | 'month' | 'list'
}
