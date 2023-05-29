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
}
