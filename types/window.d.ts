export {}
declare global {
  interface Window {
    calendarMonthPanelType: 'move' | 'resize' | null
    monthMoveScheduleActiveInfo: {
      startSchedule?: Model.Schedule.Info
      startIndex?: number
      endIndex?: number
      visibleList?: number[]
      // 包含几个日程
      length?: number
    }
    // 是否正在拖拽日程
    isMovingSchedule?: boolean
    // 是否取消视图修改
    isCloseView: boolean
    name: string
    // cos上传需要使用的参数
    cosInfo: any
  }
}
