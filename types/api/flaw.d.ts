declare namespace API.Flaw {
  namespace DeleteRelation {
    type Params = {
      project_id: number
      id: number
      relation_id: number
      type: Model.Affairs.RelationType
    }
  }
  namespace FlawRelation {
    type Params = {
      projectId: number
      id: number
      relationId: number
      type: Model.Affairs.RelationType
    }
  }

  namespace GetFlawRelationStories {
    type Params = {
      projectId: number
      id: number
      pageSize: number
      page: number
      orderKey: string
      order: string
    }
    type Result = {
      pager: {
        page: number
        pagesize: number
        total: number
      }
      list: Model.Flaw.FlawRelationStoriesInfo[]
    }
  }

  namespace DeleteFlawCommentAttach {
    type Params = {
      project_id: number
      comment_id: number
      att_id: string
    }
  }
  namespace UpdateFlawComment {
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
  namespace FlawRelationDragSort {
    type Params = {
      projectId: number
      id?: number
      relationIds: number[]
      type: Model.Flaw.RelationType
    }
  }
  namespace AddFlawRelation {
    type Params = {
      projectId: number
      id: number
      relationId: number
      type: Model.Flaw.RelationType
    }
  }
  namespace GetFlawSelectChildrenRecent {
    type Params = {
      projectId: number
      id?: number
    }
  }

  namespace GetFlawSelectChildren {
    type Params = {
      projectId: number
      id?: number
      keywords?: string
    }
    type Result = Model.Flaw.FlawInfo[]
  }

  namespace FlawChildDragSort {
    type Params = {
      projectId: number
      id?: number
      childrenIds: number[]
    }
  }
  namespace AddFlawChild {
    type Params = {
      projectId: number
      id?: number
      childId: string
    }
  }

  namespace FlawRelationDragSort {
    type Params = {
      projectId: number
      id?: number
      relationIds: number[]
      type: Model.Affairs.RelationType
    }

    type Result = Model.Flaw.FlawInfo[]
  }

  namespace GetFlawRelationList {
    type Params = {
      projectId: number
      id?: number
      searchValue?: string
    }

    type Result = Model.Flaw.FlawInfo[]
  }
  namespace GetFlawChildList {
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
      data: Model.Flaw.FlawInfo[]
    }
  }
  namespace BatchFlawEdit {
    type Params = {
      projectId: number
      demandIds: number[]
      type: string
      target: Model.Flaw.CustomFiledInfo
    }
  }
  namespace BatchFlawDelete {
    type Params = {
      projectId: number
      demandIds: number[]
      isDeleteChild: number
    }
  }
  namespace GetFlawBatchEditConfig {
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
  namespace GetFlawExcel {
    type Params = {
      projectId: number
      filePath: string
    }
  }

  namespace GetImportDownloadFlawModel {
    type Params = {
      projectId: number
      isUpdate: boolean | number
      fields: string
    }
  }
  namespace GetLoadFlawListFields {
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
  namespace UpdateFlawStatus {
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

  namespace UpdateFlawCategory {
    type Params = {
      projectId: number
      id?: number
      categoryId: number
      statusId: number
    }
  }
  namespace UpdateFlawPriority {
    type Params = {
      projectId: number
      id?: number
      priorityId: number
    }
  }
  namespace AddInfoFlaw {
    type Params = {
      projectId: number
      id?: number
      targetId:
        | Model.Flaw.AttachTarget[]
        | { name: string; color: string }[]
        | number
      type: string
    }
  }

  namespace GetFlawStatusLog {
    type Params = {
      projectId: number
      id: number
      all: boolean
    }
  }
  namespace GetFlawChangeLog {
    type Params = {
      projectId: number
      id: number
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
      list: Model.Flaw.FlawChangeLogResultInfo[]
    }
  }

  namespace AddFlawComment {
    type Params = {
      projectId: number
      id: number
      content: string
      attachment?: Model.Flaw.AddFlawCommentAttach[]
      a_user_ids?: (string | null)[]
    }
  }

  namespace DeleteFlawComment {
    type Params = {
      projectId: number
      id: number
    }
  }

  namespace GetFlawList {
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
      parentId?: number
      class_ids: number[]
      class_id?: number
      category_id: number
      schedule_start: number | string
      schedule_end: number | string
      custom_field: Model.Flaw.CustomFiledInfo
      system_view?: number | string
      pageSize: number
      page: number
      orderKey: string
      order: string
      isChildren?: boolean
      usersInfo?: Model.Flaw.ListUsersInfo[]
    }
    type SelectResult = Model.Flaw.ListItem[]
    type Result = {
      pager?: {
        page: number
        pagesize: number
        total: number
      }
      list: Model.Flaw.ListItem[]
    }
  }

  namespace GetFlawInfo {
    type Params = {
      projectId: number
      id?: number
    }

    type Result = Model.Flaw.FlawInfoResult
  }

  namespace GetFlawCommentList {
    type Params = {
      id: number
      projectId: number
      page: number
      pageSize: number
    }
    type Result = {
      a_user_ids: number[]
      app_attachment: Model.Flaw.ListItemUserOrAttach[]
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
