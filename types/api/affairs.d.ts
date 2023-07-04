declare namespace API.Affairs {
  namespace DeleteRelation {
    type Params = {
      project_id: number
      id: number
      relation_id: number
      type: Model.Affairs.RelationType
    }
  }
  namespace UpdateAffairsComment {
    type Params = {
      projectId: number
      id: number
      content: string
      storyId: number
      ids: (string | null)[]
    }
  }
  namespace UpdateEditor {
    type Params = {
      projectId: number
      info: string
      id: number
      name: string
    }
  }
  namespace AddQuickAffair {
    type Params = {
      name: string
      category_id: number
      parent_id: number
      projectId: number
    }
  }
  namespace AffairsRelationDragSort {
    type Params = {
      projectId: number
      id?: number
      relationIds: number[]
      type: Model.Affairs.RelationType
    }
  }
  namespace AddAffairsRelation {
    type Params = {
      projectId: number
      id: number
      relationId: number
      type: Model.Affairs.RelationType
    }
  }
  namespace GetAffairsSelectChildrenRecent {
    type Params = {
      projectId: number
      id?: number
    }
  }

  namespace GetAffairsSelectChildren {
    type Params = {
      projectId: number
      id?: number
      keywords?: string
    }
    type Result = Model.Affairs.AffairsInfo[]
  }

  namespace AffairsChildDragSort {
    type Params = {
      projectId: number
      id?: number
      childrenIds: number[]
    }
  }
  namespace AddAffairsChild {
    type Params = {
      projectId: number
      id?: number
      childId: string
    }
  }

  namespace GetAffairsRelationList {
    type Params = {
      projectId: number
      id?: number
      searchValue?: string
    }

    type Result = Model.Affairs.AffairsInfo[]
  }
  namespace GetAffairsChildList {
    type Params = {
      projectId: number
      id?: number
      searchValue?: string
      page: number
      pagesize: number
    }

    type Result = {
      pager: {
        page: number
        pagesize: number
        total: number
      }
      list: Model.Affairs.AffairsInfo[]
    }
  }
  namespace BatchAffairsEdit {
    type Params = {
      projectId: number
      demandIds: number[]
      type: string
      target: number | number[] | string | Model.Affairs.CustomFiledInfo
    }
  }
  namespace BatchAffairsDelete {
    type Params = {
      projectId: number
      demandIds: number[]
      isDeleteChild: number
    }
  }
  namespace GetAffairsBatchEditConfig {
    type Params = {
      projectId: number
      demandIds: number[]
    }

    type Result = {
      attr: null | string
      content: string
      content_txt: string
      is_customize: number
      title: string
      values: { content: string; id: number; parent_id: number }[]
    }[]
  }
  namespace GetAffairsExcel {
    type Params = {
      projectId: number
      filePath: string
    }
  }

  namespace GetImportDownloadAffairsModel {
    type Params = {
      projectId: number
      isUpdate: boolean | number
      fields: string
    }
  }
  namespace GetLoadAffairsListFields {
    type Params = {
      projectId: number
      isUpdate: boolean | number
      isBug: boolean | number
    }
    type Result = {
      base_fields: { field: string; name: string }[]
      time_person_fields: { field: string; name: string }[]
      custom_fields: { field: string; name: string }[]
    }
  }
  namespace UpdateAffairsStatus {
    type Params = {
      projectId: number
      nId?: number
      toId: number
      verifyId: number
      fields: {
        reviewerValue: any
      }
    }
  }

  namespace UpdateAffairsCategory {
    type Params = {
      projectId: number
      sprintId?: number
      categoryId: number
      statusId: number
    }
  }
  namespace UpdateAffairsPriority {
    type Params = {
      projectId: number
      sprintId?: number
      priorityId: number
    }
  }
  namespace AddInfoAffairs {
    type Params = {
      projectId: number
      sprintId?: number
      parentId?: number | undefined | null
      targetId?:
        | Model.Affairs.AttachTarget[]
        | { name: string; color: string }[]
        | number
        | number[]
      type: string
      name?: string
    }
  }

  namespace GetAffairsStatusLog {
    type Params = {
      projectId: number
      sprintId: number
      all: boolean
    }
  }
  namespace GetAffairsChangeLog {
    type Params = {
      projectId: number
      sprintId: number
      pageSize: number
      page: number
      orderKey: string
      order: string
    }
    type Result = {
      pager?: {
        page: number
        pagesize: number
        total: number
      }
      list: Model.Affairs.AffairsChangeLogResultInfo[]
    }
  }

  namespace AddAffairsComment {
    type Params = {
      projectId: number
      sprintId?: number
      content: string
      attachment?: Model.Affairs.AddAffairsCommentAttach[]
      a_user_ids?: (string | null)[]
    }
  }

  namespace DeleteAffairsComment {
    type Params = {
      projectId: number
      id: number
    }
  }

  namespace GetAffairsList {
    type Params = {
      discovery_version: any
      severity: any
      solution: any
      projectId: number
      searchValue: string
      iterateIds: number[]
      statusIds: number[]
      priorityIds: number[]
      userId: number[] | number
      tagIds: number[]
      startTime: string
      expectedStart: string
      expectedEnd: string
      updatedTime: string
      endTime: string
      usersNameId: number[]
      copySendId: number[]
      parentId: number
      all: boolean
      panel: boolean
      class_ids: number[]
      class_id: number
      category_id: number
      schedule_start: number | string
      schedule_end: number | string
      custom_field: Model.Affairs.CustomFiledInfo
      tree: boolean | number
      topParentId: number
      system_view: number | string
      pageSize: number
      page: number
      orderKey: string
      order: string
      isChildren?: boolean
      usersInfo: Model.Affairs.ListUsersInfo[]
    }
    type SelectResult = Model.Affairs.ListItem[]
    type Result = {
      pager?: {
        page: number
        pagesize: number
        total: number
      }
      list: Model.Affairs.ListItem[]
    }
  }

  namespace GetAffairsInfo {
    type Params = {
      projectId: number
      sprintId?: number
    }

    type Result = Model.Affairs.AffairsInfoResult
  }

  namespace GetAffairsCommentList {
    type Params = {
      sprintId: number
      projectId: number
      page: number
      pageSize: number
    }
    type Result = {
      a_user_ids: number[]
      app_attachment: Model.Affairs.ListItemUserOrAttach[]
      avatar: string
      content: string
      created_at: string
      id: number
      name: string
      status: number
      status_content: string
      story_id: number
      updated_at: string
      user_id: number
    }
  }
}
