declare namespace Model.Sprint {
  interface SprintTableData {
    id: string
    list: any[]
  }
  interface ProjectSettings {
    id: number
    name: string
    type: number
    content_txt: string
  }
  type Visible = boolean
}
