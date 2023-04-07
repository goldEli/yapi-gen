declare namespace Model.Schedule {
  interface Info {
    // id: number
    // title?: string
    // startTime: number
    // endTime: number
    // color: string
    id?: string
    // 是否展示到面板中
    hidden?: boolean
    schedule_id: number
    subject: string
    is_span_day: boolean
    // 是否是全天任务 1 是 2 否
    is_all_day: 1 | 2
    // '2023-03-02 16:33:00'
    start_datetime?: string
    // '16:33'
    start_time?: string
    // 1677745980
    start_timestamp: number
    // '2023-03-02 17:44:00'
    end_datetime?: string
    // '17:44'
    end_time?: string
    // 1677750240
    end_timestamp: number
    // "2023-03-29 16:33:00"
    schedule_start_datetime?: string
    schedule_start_timestamp?: number
    // '2023-04-01 17:44:00'
    schedule_end_datetime?: string
    schedule_end_timestamp?: number
    // 1 是 2 否
    is_busy: 1 | 2
    //
    color: number
    is_busy_text: string
    year: number
    month: number
    day: number
    // '2023-03-02'
    datetime: string
    // 1677772799
    timestamp: number
    // '2023-03-02'
    first_start_date?: string
    // '2023-03-03 16:33:00'
    first_start_datetime?: string
    // 1677745980
    first_start_timestamp?: number
    last_start_timestamp?: number
  }
  type InfoWithPosition = Info & {
    width: number
    left: number
  }
  interface ScheduleList{
    visible:boolean,
    top?:number,
    left?:number
  }
}
