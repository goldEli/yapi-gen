declare namespace Model.PerformanceInsight {
  type useInfo = {
    user_name?: string
    work_total?: number | undefined
    name?: string
    ratio?: string | undefined
  }

  type Result = {
    end_time?: string
    start_time?: string
    growth_rate?: number
    list: useInfo[]
    period_number?: number
  }
}
