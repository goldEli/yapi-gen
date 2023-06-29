declare namespace API.Efficiency {
  namespace HistoryDefectList {
    type Result = {
      id: number
      name: string
      email: string
      avatar: string
      role: {
        id: number
        name: string
      }
      work_record: Array<Models.Efficiency.WorkRecord>
      created_work: Array<Models.Efficiency.CreatedWord>
      work: Array<Models.Efficiency.CreatedWord>
      defect_record: Array<Models.Efficiency.WorkRecord>
      defect: Array<Models.Efficiency.CreatedWord>
    }
  }
  namespace HistoryWorkList {
    type Params = {
      userId: number
    }
    type Result = {
      id: number
      name: string
      email: string
      avatar: string
      role: {
        id: number
        name: string
      }
      work_record: Array<Models.Efficiency.WorkRecord>
      created_work: Array<Models.Efficiency.CreatedWord>
      work: Array<Models.Efficiency.CreatedWord>
    }
  }
  namespace StatisticsOther {
    type Params = {
      project_ids?: string | number
      iterate_ids?: string
      user_ids?: string
      start_time?: string
      end_time?: string
      period_time: string | undefined
    }
    type Result = {
      work_completion_period: {
        list: Models.Efficiency.Work[]
        growth_rate: number
        period_number: number
        growth_rate: string
        start_time: string
        end_time: string
      }
      defect_trend: {
        fixed_rate: string
        new_total: number
        fixed_total: number
        not_fixed: Array<Defect>
        fixing: Array<Defect>
        fixed: Array<Defect>
        start_time: string
        end_time: string
      }
      risk_stock: {
        total: number
        list: Models.Efficiency.risk_stock_item[]
      }
    }
  }
  namespace ViewsList {
    type Params = {
      project_id: number
      use_type: number
    }
    type Result = Array<Models.Efficiency.ViewItem>
  }
  namespace ViewsEditList {
    type Params = {
      use_type?: number
      id?: number
      project_id?: number
      status?: number
      name: string
      config?: Models.Efficiency.ConfigItem
    }
    type Result = {
      data: boolean
    }
  }
}
