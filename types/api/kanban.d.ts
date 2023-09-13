declare namespace API.Kanban {
  type SearchParams = {
    kanban_config_id: Model.KanbanConfig.Config['id']
    search?: {
      [key in string]: number | string
    }
  }
  namespace GetKanban {
    type Params = SearchParams & {
      project_id: number
      pagesize: 20
      page: 0
    }
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
      project_id: number
      // 分组类型，users:用户分组，priority：优先级，category：类别
      group_by: Model.KanBan.GroupType
      pagesize: 20
      page: 0
    }
    type Result = Model.KanBan.Group[]
  }
  // modifyKanbanIssueSort
  namespace ModifyKanbanIssueSort {
    type Params = {
      project_id: number
      kanban_column_id: Model.KanbanConfig.Config['id']
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
      // 用途，1：需求列表，2：看板，3：报表
      use_type: 1 | 2 | 3
    } & Pick<Model.KanBan.ViewItem, 'config' | 'id' | 'name' | 'type'>
    type Result = Model.KanBan.ViewItem
  }
  namespace CreateView {
    type Params = {
      project_id: number
      // 用途，1：需求列表，2：看板，3：报表
      use_type: 1 | 2 | 3
    } & Pick<Model.KanBan.ViewItem, 'config' | 'name'>
    type Result = Model.KanBan.ViewItem
  }
  namespace DelView {
    type Params =
      | Pick<Model.KanBan.ViewItem, 'id'>
      | {
          // 用途，1：需求列表，2：看板，3：报表
          use_type: 1 | 2 | 3
        }
    type Result = Model.KanBan.ViewItem
  }
  namespace UpdateStoryPriority {
    type Params = {
      project_id: number
      id: Model.KanBan.Story['id']
      priority: Model.KanBan.Group['id']
    }
    type Result = null
  }

  namespace GetFlowConfig {
    type Params = {
      story_id: Model.KanBan.Story['id']
      // 项目id
      project_id: number
      // 目标状态id
      category_status_to_id: number
    }
    type Result = {
      id: number
      name: string
    }
  }

  namespace DeleteStory {
    type Params = {
      id: Model.KanBan.Story['id']
      // 项目id
      project_id: number
    }
    type Result = {
      id: number
      name: string
    }
  }

  namespace CopyView {
    type Params = {
      id: Model.KanBan.ViewItem['id']
      // 项目id
    }
    type Result = {
      id: Model.KanBan.ViewItem['id']
    }
  }
}
