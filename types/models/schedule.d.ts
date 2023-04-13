declare namespace Model.Schedule {
  interface Info {
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
    // '2023-04-06 12:50:00'
    schedule_start_datetime?: string
    // '2023-04-06'
    schedule_start_date?: string
    // 1680756600
    schedule_start_timestamp?: number
    schedule_end_datetime?: string
    schedule_end_date?: string
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

    creator?: {
      id: integer
      name: string
      avatar: string
    }
    members?: {
      status: number
      user_id: number
      status_text: string
      user: {
        id: number
        name: string
        avatar: string
      }
    }[]
    describe?: string
    files?: {
      url: string
      user_id: string
      created_at: string
      user: {
        id: number
        name: string
        avatar: string
      }
    }[]
    reminds?: {
      before_time: number
      remind_type_text: string
    }[]
    calendar_name?: string
    is_join?: boolean
    join_member_status?: number
    is_creator?: boolean
    title?: string
  }
  type DetailInfo = Info & {
    creator?: {
      id: integer
      name: string
      avatar: string
    }
    members?: {
      status: number
      user_id: number
      status_text: string
      user: {
        id: number
        name: string
        avatar: string
      }
    }[]
    describe?: string
    files?: {
      url: string
      user_id: string
      created_at: string
      user: {
        id: number
        name: string
        avatar: string
      }
    }[]
    reminds?: {
      before_time: number
      remind_type_text: string
    }[]
    calendar_name?: string
    is_join?: boolean
    join_member_status?: number
    is_creator?: boolean
    title?: string
  }
  type InfoWithPosition = Info & {
    width: number
    left: number
  }
  interface ScheduleList {
    visible: boolean
    top?: number
    left?: number
    date?: number
    scheduleListData?: any
  }
}
