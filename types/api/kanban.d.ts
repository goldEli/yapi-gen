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
    type Params = SearchParams & {
      // 分组类型，users:用户分组，priority：优先级，category：类别
      group_by: Model.KanBan.GroupType
    }
    type Result = Model.KanBan.Group[]
  }
  // modifyKanbanIssueSort
  namespace ModifyKanbanIssueSort {
    type Params = {
      kanban_config_id: Model.KanbanConfig.Config['id']
      story_ids: Model.KanBan.Story['id'][]
    }
    type Result = null
  }
  namespace GetStoryViewList {
    type Params = {
      project_id: number
      // 用途，1：需求列表，2：看板，3：报表
      use_type: 1 | 2 | 3
    }
    type Result = Model.KanBan.ViewItem[]
  }
  namespace UpdateView {
    type Params = {
      project_id: number
    } & Pick<Model.KanBan.ViewItem, 'config' | 'id' | 'name' | 'type'>
    type Result = null
  }
  namespace CreateView {
    type Params = {
      project_id: number
    } & Pick<Model.KanBan.ViewItem, 'config' | 'name'>
    type Result = null
  }
  namespace DelView {
    type Params = Pick<Model.KanBan.ViewItem, 'id'>
    type Result = null
  }
}
