declare namespace Model.Calendar {
  interface Info {
    id: string
  }
  interface Schedule {
    id: string
    title?: string
    startTime: number
    endTime: number
  }
  interface Calendar {
    id: string
    color: string
    name: string
  }
  /**
   * 日历面板按照不同类型展示
   */
  type CalendarPanelType = 'year' | 'day' | 'week' | 'month' | 'list'
}
