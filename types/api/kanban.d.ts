declare namespace API.Kanban {
  type SearchParams = {
    kanban_config_id: Model.KanbanConfig.Config['id']
    search?: {
      [key in string]: number | string
    }
  }
  namespace GetKanban {
    type Params = SearchParams
    type Result = Model.Kanban.Column[]
  }
}
