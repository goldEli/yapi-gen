declare namespace Model.Sprint {
  interface Task {
    name: string
  }
  interface ProjectSettings{
    id:number,
    name:string,
    type:number,
    content_txt:string
  }
  type Visible = boolean
}
