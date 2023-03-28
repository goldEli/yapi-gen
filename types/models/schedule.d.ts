declare namespace Model.Schedule {
  interface Info {
    id: number
    title?: string
    startTime: number
    endTime: number
    color: string
  }
  type InfoWithPosition = Info & {
    width: number
    left: number
  }
}