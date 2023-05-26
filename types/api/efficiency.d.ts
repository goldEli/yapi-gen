declare namespace API.Member {
  namespace CreateKanbanConfig {
    type Params = {
      name: string
      project_id: number
    }
    type Result = {
      name: string
      project_id: number
      creator_id: number
      updated_at: string
      created_at: string
      id: number
    }
  }
}
