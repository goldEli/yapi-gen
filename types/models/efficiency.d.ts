declare namespace Models.Efficiency {
  export interface WorkRecord {
    date: string
    list: Array<WorkRecordList>
  }
  export interface WorkRecordList {
    name: string
    status_from: {
      id: number
      content: string
    }
    status_to: {
      id: number
      content: string
    }
    expected_start_at: string
    expected_end_at: string
    created_at: string
  }
  export interface CreatedWord {
    status_name: string
    isOpen?: boolean
    list: Array<CreatedWordList>
  }
  export interface CreatedWordList {
    name: string
    parent_name: string
    expected_start_at: string
    expected_end_at: string
    created_at: string
  }
  export interface FileUploadTask {
    id: string
    state: string
    loaded: number
    percent: number
    file: File
  }
  export interface WorkingStatus {
    title: string
    time: string
    data: Array<Model.Sprint.WorkListItem>
    homeType: string
    num: number
    projectId: number
    viewType: number
  }
  export interface ChartBar {
    chartType: string
    yData: Array<string | undefined>
    seriesData?: Array<number | undefined>
    time: string
    growth_rate: number
    period_number?: number
  }
  export interface ChartBar4 {
    chartType: string
    yData: Array<string | undefined>
    seriesData?: Array<number | undefined>
    time: string
    growth_rate: number
  }
  export interface ChartPie {
    chartType?: string
    color?: Array<string>
    time?: string
    color?: Array<string>
    seriesData: Array<[string, number]>
    total?: number
  }
  export interface Work {
    completed: number
    start_time: string
    end_time?: string
    is_current: boolean
  }
  export interface WorkChart {
    growth_rate: number
    time: string
    yData: string[]
    seriesData: number[]
    period_number: number
  }
  export interface Defect {
    number: number
    rate: string
    date: string
  }
  export interface ChartSpline {
    yData: string[]
    time: string
    fixed_rate: string
    new_total: number
    fixed_total: number
    seriesData: Array<{ name: string; data: number[]; dataNum: number[] }>
  }
  export interface ViewItem {
    id: number
    name: string
    label: string
    status: number
    type: number
    key: string
    is_default?: number
    config: ConfigItem
  }
  export interface ConfigItem {
    project_id?: number[]
    user_ids?: number[]
    start_time?: string
    end_time?: string
    period_time?: string
    iterate_ids?: number[]
  }
  export interface HeaderParmas {
    iterate_ids?: number[]
    projectIds?: number[] | []
    users?: []
    time: {
      type: number
      time: string[] | string
    }
    view: {
      title: string
      value: number
    }
    period_time: string
  }
  export interface risk_stock_item {
    name: string
    number: number
    ratio: string
  }
}
