declare namespace Models.Files {
  export interface File {
    space?: string
    id: string
    name: string
    url: string
    size: number
    formattedSize: string
    suffix: string
    time: string
  }

  export interface FileUploadTask {
    id: string
    state: string
    loaded: number
    percent: number
    file: File
  }
}
