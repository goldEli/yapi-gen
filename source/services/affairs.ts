/* eslint-disable no-undefined */
import * as http from '@/tools/http'

// 删除事务
export const deleteAffairs = async (params: {
  projectId: number
  id: number
  isDeleteChild?: number
}) => {
  await http.post<any>('deleteAffairs', {
    project_id: params.projectId,
    id: params.id,
    is_delete_childs: params.isDeleteChild,
  })
}

// 处理事务列表数据
const getListItem = (array: any, params: API.Affairs.GetAffairsList.Params) => {
  return array?.map((i: any) => ({
    id: i.id,
    name: i.name,
    demand: i.child_story_count,
    priority: i.priority,
    iteration: i.iterate_name,
    status: i.status,
    dealName: i.users_name || '--',
    time: i.created_at,
    expectedStart: i.expected_start_at,
    expectedEnd: i.expected_end_at,
    info: i.info,
    userIds: i.user_id,
    iterateId: i.iterate_id,
    parentId: i.parent_id,
    finishTime: i.finish_at,
    updatedTime: i.updated_at,
    usersCopySendName: i.users_copysend_name,
    userName: i.user_name,
    tag: i.tag,
    isExamine: i.verify_lock === 1,
    category: i.category,
    class: i.class,
    schedule: i.schedule,
    ...i.custom_field,
    categoryColor: i.category_color,
    categoryRemark: i.category_remark,
    category_attachment: i.category_attachment,
    categoryId: i.category_id,
    project_id: i.project_id,
    usersNameIds: i.users_name_ids,
    usersCopySendIds: i.users_copysend_name_ids,
    allChildrenCount: i.all_child_story_count,
    allChildrenIds: i.all_child_ids,
    children: getListItem(i.children, params) || null,
    level: i.level,
    isExpended: true,
    topId: params?.parentId ?? params?.topParentId,
    categoryConfigList: i.category_config_list,
    storyPrefixKey: i.story_prefix_key,
    work_type: i.work_type,
    usersInfo: i.usersInfo,
  }))
}

// 纯数组-事务列表
export const getAffairsSelectList = async (
  params: API.Affairs.GetAffairsList.Params,
) => {
  const response = await http.get<any, API.Affairs.GetAffairsList.SelectResult>(
    'getAffairsList',
    {
      search: {
        project_id: params?.projectId,
        keyword: params?.searchValue,
        iterate_id: params?.iterateIds,
        status: params?.statusIds,
        priority: params?.priorityIds,
        user_id: params?.userId,
        tag: params?.tagIds,
        created_at: params?.startTime,
        expected_start_at: params?.expectedStart,
        expected_end_at: params?.expectedEnd,
        updated_at: params?.updatedTime,
        finish_at: params?.endTime,
        users_name: params?.usersNameId,
        users_copysend_name: params?.copySendId,
        parent_id: params?.parentId,
        all: params?.all ? 1 : 0,
        panel: params?.panel ? 1 : 0,
        class_ids: params.class_ids,
        class_id: params.class_id,
        category_id: params.category_id,
        schedule_start: params.schedule_start,
        schedule_end: params.schedule_end,
        custom_field: params?.custom_field,
        tree: params?.tree || 0,
        top_parent_id: params?.topParentId,
        system_view: params?.system_view,
      },
      pagesize: params?.pageSize,
      page: params?.page,
      orderkey: params?.orderKey,
      order: params?.order,
    },
  )
  return response.data.map((i: any) => ({
    id: i.id,
    name: i.name,
    usersNameIds: i.users_name_ids,
    usersCopySendIds: i.users_copysend_name_ids,
    dealName: i.users_name?.split(';') || [],
    status: i.status,
    iteration: i.iterate_name,
    schedule: i.schedule,
    project_id: i.project_id,
    category: i.category,
    categoryColor: i.category_color,
    categoryRemark: i.category_remark,
    category_attachment: i.category_attachment,
    isExamine: i.verify_lock === 1,
    priority: i.priority,
    storyPrefixKey: i.story_prefix_key,
    categoryId: i.category_id,
  }))
}

// 获取事务列表 -- list格式
export const getAffairsList = async (
  params: API.Affairs.GetAffairsList.Params,
) => {
  const response = await http.get<any, API.Affairs.GetAffairsList.Result>(
    'getAffairsList',
    {
      search: {
        project_id: params?.projectId,
        keyword: params?.searchValue,
        iterate_id: params?.iterateIds,
        status: params?.statusIds,
        priority: params?.priorityIds,
        user_id: params?.userId,
        tag: params?.tagIds,
        created_at: params?.startTime,
        expected_start_at: params?.expectedStart,
        expected_end_at: params?.expectedEnd,
        updated_at: params?.updatedTime,
        finish_at: params?.endTime,
        users_name: params?.usersNameId,
        users_copysend_name: params?.copySendId,
        parent_id: params?.parentId,
        all: params?.all ? 1 : 0,
        panel: params?.panel ? 1 : 0,
        class_ids: params.class_ids,
        class_id: params.class_id,
        category_id: params.category_id,
        schedule_start: params.schedule_start,
        schedule_end: params.schedule_end,
        custom_field: params?.custom_field,
        tree: params?.tree || 0,
        top_parent_id: params?.topParentId,
        system_view: params?.system_view,
      },
      pagesize: params?.pageSize,
      page: params?.page,
      orderkey: params?.orderKey,
      order: params?.order,
    },
  )

  if (params?.isChildren) {
    return {
      list: getListItem(response.data, params),
    }
  }
  return {
    currentPage: params.page,
    pageSize: params.pageSize,
    total: response.data.pager?.total,
    list: response.data.list.map((i: any) => ({
      id: i.id,
      name: i.name,
      demand: i.child_story_count,
      priority: i.priority,
      iteration: i.iterate_name,
      status: i.status,
      dealName: i.users_name || '--',
      time: i.created_at,
      expectedStart: i.expected_start_at,
      expectedEnd: i.expected_end_at,
      info: i.info,
      userIds: i.user_id,
      iterateId: i.iterate_id,
      parentId: i.parent_id,
      finishTime: i.finish_at,
      updatedTime: i.updated_at,
      usersCopySendName: i.users_copysend_name,
      userName: i.user_name,
      tag: i.tag,
      isExamine: i.verify_lock === 1,
      category: i.category,
      class: i.class,
      schedule: i.schedule,
      ...i.custom_field,
      categoryColor: i.category_color,
      categoryRemark: i.category_remark,
      categoryId: i.category_id,
      project_id: i.project_id,
      usersNameIds: i.users_name_ids,
      usersCopySendIds: i.users_copysend_name_ids,
      category_attachment: i.category_attachment,
      allChildrenCount: i.all_child_story_count,
      allChildrenIds: i.all_child_ids,
      children: getListItem(i.children, params) || null,
      isExpended: params.topParentId === i.id,
      level: 1,
      topId: i.id,
      categoryConfigList: i.category_config_list,
      storyPrefixKey: i.story_prefix_key,
      work_type: i.work_type,
      usersInfo: i.usersInfo,
    })),
  }
}

// 获取事务详情
export const getAffairsInfo = async (
  params: API.Affairs.GetAffairsInfo.Params,
) => {
  const response = await http.get<any, API.Affairs.GetAffairsInfo.Result>(
    'getAffairsInfo',
    {
      project_id: params.projectId,
      id: params.sprintId,
    },
  )

  return {
    category_attachment: response.data.category_attachment,
    id: response.data.id,
    name: response.data.name || '--',
    info: response.data.info.replaceAll('\n', '<br/>'),
    priority: response.data.priority,
    expectedStart: response.data.expected_start_at,
    expectedEnd: response.data.expected_end_at,
    finishTime: response.data.finish_at,
    demandCount: response.data.story_count,
    iterateName: response.data.iterate_name || '--',
    userName: response.data.user_name,
    childCount: response.data.child_story_count,
    parentName: response.data.parent_name,
    attachment: response.data.attachment,
    tag: response.data.tag,
    copySend: response.data.copysend,
    user: response.data.user || '--',
    createdTime: response.data.created_at,
    status: response.data.status,
    parentId: response.data.parent_id || null,
    changeCount: response.data.app_changelog_count,
    iterateId: response.data.iterate_id || null,
    projectId: response.data.project_id,
    isExamine: response.data.verify_lock === 1,
    customField: response.data.custom_field,
    schedule: response.data.schedule,
    category: response.data.category_id,
    class: response.data.class_id ? response.data.class_id : null,
    className: response.data.class,
    prefixKey: response.data.prefix_key,
    projectPrefix: response.data.project_prefix,
    hierarchy: response.data.hierarchy,
    level_tree: response.data.level_tree,
    categoryName: response.data.category,
  }
}

// 获取事务评论列表
export const getAffairsCommentList = async (
  params: API.Affairs.GetAffairsCommentList.Params,
) => {
  const response: any = await http.get<
    any,
    API.Affairs.GetAffairsCommentList.Params
  >('getAffairsCommentList', {
    search: {
      story_id: params.sprintId,
      project_id: params.projectId,
    },
    page: params.page,
    pagesize: params.pageSize,
  })

  return {
    list: response.data.list.map((i: any) => ({
      id: i.id,
      name: i.name,
      content: i.content,
      avatar: i.avatar,
      createdTime: i.created_at,
      statusContent: i.status_content,
      userId: i.user_id,
      attachment: i.app_attachment,
    })),
  }
}

// 添加评论
export const addAffairsComment = async (
  params: API.Affairs.AddAffairsComment.Params,
) => {
  await http.post<any>('addAffairsComment', {
    project_id: params.projectId,
    story_id: params.sprintId,
    content: params.content,
    attachment: params.attachment,
    a_user_ids: params.a_user_ids,
  })
}

// 删除评论
export const deleteAffairsComment = async (
  params: API.Affairs.DeleteAffairsComment.Params,
) => {
  await http.delete<any>('deleteAffairsComment', {
    project_id: params.projectId,
    id: params.id,
  })
}

// 事务变更记录
export const getAffairsChangeLog = async (
  params: API.Affairs.GetAffairsChangeLog.Params,
) => {
  const response = await http.get<any, API.Affairs.GetAffairsChangeLog.Result>(
    'getAffairsChangeLog',
    {
      search: {
        story_id: params.sprintId,
        project_id: params.projectId,
      },
      pagesize: params.pageSize,
      page: params.page,
      orderkey: params.orderKey,
      order: params.order,
    },
  )
  return {
    currentPage: params.page,
    total: response.data.pager?.total,
    list: response.data.list.map((i: any) => ({
      id: i.id,
      fields: i.fields,
      userName: i.user_name,
      updateTime: i.created_at,
      type: i.change_log_type,
      beforeField: JSON.stringify(i.before) === '[]' ? {} : i.before,
      afterField: i.after,
    })),
  }
}

// 事务流转记录
export const getAffairsStatusLog = async (
  params: API.Affairs.GetAffairsStatusLog.Params,
) => {
  const response = await http.get<any>('getAffairsStatusLog', {
    search: {
      story_id: params.sprintId,
      project_id: params.projectId,
      all: params?.all ? 1 : 0,
    },
    order: 'asc',
    orderkey: 'id',
  })
  return response.data?.map((i: any) => ({
    operationName: i.user_name,
    time: i.created_at,
    id: i.id,
    is_end: i.is_end,
    is_start: i.is_end,
    statusTo: i.statusto
      ? {
          color: i.statusto?.color,
          name: i.statusto?.content,
        }
      : null,
    changeType: i.change_type,
    fields: i.fields,
    verifyAll: {
      id: i.verify?.id,
      statusFrom: i.verify?.statusfrom
        ? {
            color: i.verify?.statusfrom?.color,
            name: i.verify?.statusfrom?.content,
          }
        : null,

      // 整条审核的状态  1-待审核  2-已通过 3-未通过
      verifyStatus: i.verify?.verify_status,
      verify: {
        // 1：固定审核流程；2：用户指定审核人
        verifyType: i.verify?.verify?.verify_type,
        fixedUser: {
          comment: i.verify?.verify?.fixedUser?.verify_opinion,
          verifyStatus: i.verify?.verify?.fixedUser?.verify_status,
          userName: i.verify?.verify?.fixedUser?.user_name,
        },
        process: i.verify?.verify?.process?.map((k: any) => ({
          operator: k.operator,
          verifyUsers: k.verify_users?.map((j: any) => ({
            id: j.id,
            name: j.name,
            verifyStatus: j.verify_status,
            verifyOpinion: j.verify_opinion,
            time: j.verify_at,
          })),
        })),
      },
    },
  }))
}

// 添加事务详情关联
export const addInfoAffairs = async (
  params: API.Affairs.AddInfoAffairs.Params,
) => {
  await http.put<any>('addInfoAffairs', {
    project_id: Number(params.projectId),
    id: Number(params.sprintId),
    target: params.targetId,
    type: params.type,
  })
}

// 删除事务详情关联
export const deleteInfoAffairs = async (
  params: API.Affairs.AddInfoAffairs.Params,
) => {
  await http.put<any>('deleteInfoAffairs', {
    project_id: Number(params.projectId),
    id: Number(params.sprintId),
    target_id: params.targetId,
    type: params.type,
  })
}

// 快捷修改参数
export const updateAffairsTableParams = async (params: any) => {
  await http.put<any>('changeAffairsTableParams', {
    project_id: params.projectId,
    id: params.id,
    ...params.otherParams,
  })
}

// 修改优先级
export const updateAffairsPriority = async (
  params: API.Affairs.UpdateAffairsPriority.Params,
) => {
  await http.put<any>('updateAffairsPriority', {
    priority: params.priorityId,
    id: params.sprintId,
    project_id: params.projectId,
  })
}

// 修改事务类型
export const updateAffairsCategory = async (
  params: API.Affairs.UpdateAffairsCategory.Params,
) => {
  await http.put<any>('updateAffairsCategory', {
    project_id: params.projectId,
    story_id: params.sprintId,
    category_id: params.categoryId,
    status_id: params.statusId,
  })
}

// 修改事务状态
export const updateAffairsStatus = async (
  params: API.Affairs.UpdateAffairsStatus.Params,
) => {
  delete params.fields.reviewerValue
  await http.put<any>('updateAffairsStatus', {
    project_id: params.projectId,
    story_id: params.nId,
    category_status_to_id: params.toId,
    fields: params.fields,
    verify_user_id: params.verifyId ?? undefined,
  })
}

export const getLoadAffairsListFields = async (
  params: API.Affairs.GetLoadAffairsListFields.Params,
) => {
  const response: any = await http.get<
    any,
    API.Affairs.GetLoadAffairsListFields.Result
  >('getLoadAffairsListFields', {
    project_id: params.projectId,
    is_update: params.isUpdate,
    is_bug: params.isBug,
  })

  return {
    baseFields: response.data.base_fields,
    timeAndPersonFields: response.data.time_person_fields,
    customFields: response.data.custom_fields,
  }
}

// 导出事务字段列表
export const getExportAffairsFields = async (params: { projectId: number }) => {
  const response: any = await http.get<
    any,
    API.Affairs.GetLoadAffairsListFields.Result
  >('getExportAffairsFields', {
    project_id: params.projectId,
  })

  return {
    baseFields: response.data.base_fields,
    timeAndPersonFields: response.data.time_person_fields,
    customFields: response.data.custom_fields,
  }
}

// 获取下载模板
export const getImportDownloadAffairsModel = async (
  params: API.Affairs.GetImportDownloadAffairsModel.Params,
) => {
  const response = await http.get(
    'getImportDownloadAffairsModel',
    {
      is_update: params.isUpdate,
      project_id: params.projectId,
      fields: params.fields,
    },
    { responseType: 'blob' },
  )

  return response
}

// 导入事务
export const getImportAffairsExcel = async (
  params: API.Affairs.GetAffairsExcel.Params,
) => {
  const formData = new FormData()
  formData.append('project_id', String(params.projectId))
  formData.append('file_path', params.filePath)
  const response = await http.post('getImportAffairsExcel', formData, {
    headers: {
      'Content-Type': undefined,
    },
  })

  return {
    successCount: response.data.count || 0,
    errorCount: response.data.error_list
      ? Object.keys(response.data.error_list)?.length
      : 0,
    errorList: response.data.error_list ? response.data.error_list : {},
  }
}

// 导入更新
export const getImportAffairsExcelUpdate = async (
  params: API.Affairs.GetAffairsExcel.Params,
) => {
  const formData = new FormData()
  formData.append('project_id', String(params.projectId))
  formData.append('file_path', params.filePath)
  const response = await http.post('getImportAffairsExcelUpdate', formData, {
    headers: {
      'Content-Type': undefined,
    },
  })

  return {
    successCount: response.data.count || 0,
    errorCount: response.data.error_list
      ? Object.keys(response.data.error_list)?.length
      : 0,
    errorList: response.data.error_list ? response.data.error_list : {},
  }
}

// 导出事务
export const getExportAffairsExcel = async (params: any) => {
  const response = await http.post(
    'getExportAffairsExcel',
    {
      search: {
        project_id: params?.projectId,
        keyword: params?.searchValue,
        iterate_id: params?.iterateId,
        status: params?.statusId,
        priority: params?.priorityId,
        user_id: params?.userId,
        tag: params?.tagId,
        created_at: params?.createdAtId,
        expected_start_at: params?.expectedStartAtId,
        expected_end_at: params?.expectedendat,
        updated_at: params?.updatedat,
        finish_at: params?.finishAt,
        users_name: params?.usersnameId,
        users_copysend_name: params?.usersCopysendNameId,
        all: params?.all ? 1 : 0,
        panel: params?.panel ? 1 : 0,
        class_ids: params.class_ids,
        class_id: params.class_id,
        category_id: params.category_id,
        schedule_start: params.schedule_start,
        schedule_end: params.schedule_end,
        custom_field: params?.custom_field,
      },
      pagesize: params?.pageSize,
      page: params?.page,
      orderkey: params?.orderKey,
      order: params?.order,
      fields: params.fields,
    },
    { responseType: 'blob' },
  )
  return response
}

// 获取批量编辑的配置属性
export const getAffairsBatchEditConfig = async (
  params: API.Affairs.GetAffairsBatchEditConfig.Params,
) => {
  const response: any = await http.get<
    any,
    API.Affairs.GetAffairsBatchEditConfig.Result
  >('getBatchEditAffairsConfig', {
    project_id: params.projectId,
    story_ids: params.demandIds,
  })

  return response.data?.map((i: any) => ({
    label: i.title,
    value: i.content,
    selectList: i.values || [],
    attr: i.attr,
  }))
}

// 事务批量删除
export const batchAffairsDelete = async (
  params: API.Affairs.BatchAffairsDelete.Params,
) => {
  await http.delete<any>('batchAffairsDelete', {
    project_id: params.projectId,
    story_ids: params.demandIds,
    is_delete_childs: params.isDeleteChild,
  })
}

// 事务批量编辑
export const batchAffairsEdit = async (
  params: API.Affairs.BatchAffairsEdit.Params,
) => {
  await http.put<any>('batchAffairsEdit', {
    project_id: params.projectId,
    story_ids: params.demandIds,
    type: params.type,
    target: params.target,
  })
}

// 获取子事务列表
export const getAffairsChildList = async (
  params: API.Affairs.GetAffairsChildList.Params,
) => {
  const response = await http.get<any, API.Affairs.GetAffairsChildList.Result>(
    'getAffairsChildList',
    {
      project_id: params.projectId,
      id: params.id,
      keywords: params.searchValue,
      page: params.page,
      pagesize: params.pagesize,
    },
  )

  return {
    currentPage: response.data.pager?.page,
    pageSize: response.data.pager?.pagesize,
    total: response.data.pager?.total,
    list: response.data,
  }
}

//  下拉添加子事务
export const addAffairsChild = async (
  params: API.Affairs.AddAffairsChild.Params,
) => {
  await http.post<any>('addAffairsChild', {
    project_id: params.projectId,
    id: params.id,
    child_id: params.childId,
  })
}

// 子事务拖拽排序
export const affairsChildDragSort = async (
  params: API.Affairs.AffairsChildDragSort.Params,
) => {
  await http.post<any>('affairsChildDragSort', {
    project_id: params.projectId,
    id: params.id,
    children_ids: params.childrenIds,
  })
}

// 搜索查询下拉子事务
export const getAffairsSelectChildren = async (
  params: API.Affairs.GetAffairsSelectChildren.Params,
) => {
  const response = await http.get<
    any,
    API.Affairs.GetAffairsSelectChildren.Result
  >('getAffairsSelectChildren', {
    project_id: params.projectId,
    id: params.id,
  })

  return response.data
}

// 最近子事务查询
export const getAffairsSelectChildrenRecent = async (
  params: API.Affairs.GetAffairsSelectChildrenRecent.Params,
) => {
  const response = await http.get<any>('getAffairsSelectChildrenRecent', {
    project_id: params.projectId,
    id: params.id,
  })
  return response.data
}

// 获取链接事务列表
export const getAffairsRelationStoriesList = async (
  params: API.Affairs.GetAffairsRelationList.Params,
) => {
  const response = await http.get<
    any,
    API.Affairs.GetAffairsRelationList.Result
  >('getAffairsRelationStoriesList', {
    project_id: params.projectId,
    id: params.id,
  })

  return {
    list: response.data,
  }
}

//  添加关联事务
export const addAffairsRelation = async (
  params: API.Affairs.AddAffairsRelation.Params,
) => {
  await http.post<any>('addAffairsRelation', {
    project_id: params.projectId,
    id: params.id,
    relation_id: params.relationId,
    type: params.type,
  })
}

// 关联事务拖拽排序
export const affairsRelationDragSort = async (
  params: API.Affairs.AffairsRelationDragSort.Params,
) => {
  await http.post<any>('affairsRelationDragSort', {
    project_id: params.projectId,
    id: params.id,
    relation_ids: params.relationIds,
    type: params.type,
  })
}

// 搜索查询下拉关联事务
export const getAffairsSelectRelationSearch = async (
  params: API.Affairs.GetAffairsRelationList.Params,
) => {
  const response = await http.get<
    any,
    API.Affairs.GetAffairsRelationList.Result
  >('getAffairsSelectRelationSearch', {
    project_id: params.projectId,
    id: params.id,
    keywords: params.searchValue,
  })

  return response.data
}

// 最近子事务查询
export const getAffairsSelectRelationRecent = async (
  params: API.Affairs.GetAffairsRelationList.Params,
) => {
  const response = await http.get<
    any,
    API.Affairs.GetAffairsRelationList.Result
  >('getAffairsSelectRelationRecent', {
    project_id: params.projectId,
    id: params.id,
  })
  return response.data
}

// 创建子事务-快捷
export const addQuickAffairs: any = async (
  params: API.Affairs.AddQuickAffair.Params,
) => {
  await http.post<any>('addAffairs', {
    project_id: Number(params.projectId),
    name: params.name,
    category_id: params?.category_id,
    parent_id: params?.parent_id || 0,
  })
}