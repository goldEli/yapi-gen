declare namespace Model.Calendar {
  interface Info {
    id: string
  }

  /**
   * 日历面板按照不同类型展示
   */
  type CalendarPanelType = 'year' | 'day' | 'week' | 'month' | 'list'
}
