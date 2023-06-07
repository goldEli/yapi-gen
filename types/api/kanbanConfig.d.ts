declare namespace API.KanbanConfig {
  namespace GetKanbanConfigList {
    type Params = {
      project_id: number
    }
    type Result = Model.KanbanConfig.ConfigListItem[]
  }

  namespace CreateKanbanConfig {
    type Params = {
      name: string
      project_id: number
      columns?: Model.KanbanConfig.Column[]
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

  namespace UpdateKanbanConfig {
    type Params = Pick<
      Model.KanbanConfig.Config,
      'id' | 'name' | 'project_id' | 'is_default' | 'columns'
    >
    // type Params = {
    //   // 必需 看板配置id
    //   id: number
    //   // 必需 看板配置名称
    //   name: string
    //   // 必需 看板配置所属项目
    //   project_id: number
    //   // 是否默认
    //   is_default:
    // }
    type Result = {
      id: number
      project_id: number
      name: string
      is_default: 0 | 1
      sort: number
      creator_id: number
      updated_at: string
      created_at: string
    }
  }
  namespace DeleteKanbanConfig {
    type Params = {
      // 必需 看板配置id
      id: number
      project_id: number
    }
    type Result = null
  }

  namespace GetKanbanConfigRemainingStatus {
    type Params = {
      // 必需 看板配置id
      id: number
      project_id: number
    }
    type Result = Model.KanbanConfig.Status[]
  }
  // namespace GetKanbanConfig {
  //   type Params = {
  //     // 必需 看板配置id
  //     id: number
  //     project_id: number
  //   }
  //   type Result = Model.KanbanConfig.Config
  // }
  namespace GetKanbanConfig {
    type Params = {
      // 必需 看板配置id
      id: number
      project_id: number
    }
    type Result = Model.KanbanConfig.Config
  }
  // GetCategoryList
  namespace GetCategoryList {
    type Params = {
      is_select: 1 | 2
      project_id: number
    }
    type Result = Model.KanbanConfig.Category[]
  }
}
