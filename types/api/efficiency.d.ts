declare namespace API.Efficiency {
  namespace HistoryWorkList {
    type Params = {
      id: number
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
      created_word: Array<Models.Efficiency.CreatedWord>
      word: Array<Models.Efficiency.CreatedWord>
    }
  }
  namespace StatisticsOther {
    type Params = {
      project_ids?: string
      iterate_ids?: string
      user_ids?: string
      start_time?: string
      end_time?: string
    }
    type Result = {
      work_completion_period: {
        list: Models.Efficiency.Work
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
    }
  }
  namespace ViewsList {
    type Params = {
      project_id: string
      use_type: number
    }
    type Result = {
      data: Array<Models.Efficiency.ViewItem>
    }
  }
  namespace ViewsEditList {
    type Params = {
      id: number
      project_id?: number[]
      status?: number
      name: string
    }
    type Result = {
      data: boolean
    }
  }
}
