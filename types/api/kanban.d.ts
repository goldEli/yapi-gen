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
  namespace CreateKanbanPeopleGrouping {
    type Params = {
      project_id: number
      name: string
      user_ids: number[]
    }
    type Result = {
      name: string
      updated_at: string
      created_at: string
      id: number
    }
  }

  namespace ModifyKanbanPeopleGrouping {
    type Params = {
      id: number
      project_id: number
      name: string
      user_ids: number[]
    }
    type Result = null
  }
  // getKanbanByGroup
  namespace GetKanbanByGroup {
    type Params = SearchParams
    type Result = Model.KanBan.Group[]
  }
  // modifyKanbanIssueSort
  namespace ModifyKanbanIssueSort {
    type Params = {
      kanban_config_id: Model.KanbanConfig.Config['id']
      story_ids: Model.KanBan.Story['id']
    }
    type Result = null
  }
}
