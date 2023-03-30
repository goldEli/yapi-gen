declare namespace Model.Schedule {
  interface Info {
    id: number
    title?: string
    startTime: number
    endTime: number
    color: string
    // 是否是全天任务 1 是 2 否
    is_all_day: 1 | 2
  }
  type InfoWithPosition = Info & {
    width: number
    left: number
  }
}
