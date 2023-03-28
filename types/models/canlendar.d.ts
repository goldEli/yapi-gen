declare namespace Model.Calendar {
  interface Info {
    id: number
    color: string
    // 1 是默认的日历
    is_default: 0 | 1
  }

  /**
   * 日历面板按照不同类型展示
   */
  type CalendarPanelType = 'year' | 'day' | 'week' | 'month' | 'list'
}
