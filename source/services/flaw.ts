/* eslint-disable no-undefined */
import { filterTreeData, transData } from '@/tools'
import * as http from '@/tools/http'

// 删除缺陷
export const deleteFlaw = async (params: {
  projectId: number
  id: number
  isDeleteChild?: number
}) => {
  await http.post<any>('deleteFlaw', {
    project_id: params.projectId,
    id: params.id,
    is_delete_childs: params.isDeleteChild,
  })
}

// 纯数组-缺陷列表
export const getFlawSelectList = async (
  params: API.Flaw.GetFlawList.Params,
) => {
  const response = await http.get<any, API.Flaw.GetFlawList.SelectResult>(
    'getFlawList',
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
        class_ids: params.class_ids,
        class_id: params.class_id,
        category_id: params.category_id,
        schedule_start: params.schedule_start,
        schedule_end: params.schedule_end,
        custom_field: params?.custom_field,
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

// 获取缺陷列表 -- list格式
export const getFlawList = async (params: API.Flaw.GetFlawList.Params) => {
  const response = await http.get<any, API.Flaw.GetFlawList.Result>(
    'getFlawList',
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
        class_ids: params.class_ids,
        class_id: params.class_id,
        category_id: params.category_id,
        schedule_start: params.schedule_start,
        schedule_end: params.schedule_end,
        custom_field: params?.custom_field,
        system_view: params?.system_view,
      },
      pagesize: params?.pageSize,
      page: params?.page,
      orderkey: params?.orderKey,
      order: params?.order,
    },
  )

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
      level: 1,
      topId: i.id,
      categoryConfigList: i.category_config_list,
      storyPrefixKey: i.story_prefix_key,
      work_type: i.work_type,
      usersInfo: i.usersInfo,
      is_bug: i.is_bug,
      project_type: i.project_type,
      solution: i.solution,
      discovery_version_name: i.discovery_version_name,
      severity: i.severity,
      discovery_version: i.discovery_version,
    })),
  }
}

// 获取缺陷详情
export const getFlawInfo = async (params: API.Flaw.GetFlawInfo.Params) => {
  const response = await http.get<any, API.Flaw.GetFlawInfo.Result>(
    'getFlawInfo',
    {
      project_id: params.projectId,
      id: params.id,
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
    child_story_statistics: response.data.child_story_statistics,
    project_type: response.data.project_type,
  }
}

// 获取缺陷评论列表
export const getFlawCommentList = async (
  params: API.Flaw.GetFlawCommentList.Params,
) => {
  const response: any = await http.get<any, API.Flaw.GetFlawCommentList.Result>(
    'getFlawCommentList',
    {
      search: {
        story_id: params.id,
        project_id: params.projectId,
      },
      page: params.page,
      pagesize: params.pageSize,
    },
  )

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
export const addFlawComment = async (
  params: API.Flaw.AddFlawComment.Params,
) => {
  await http.post<any>('addFlawComment', {
    project_id: params.projectId,
    story_id: params.id,
    content: params.content,
    attachment: params.attachment,
    a_user_ids: params.a_user_ids,
  })
}

// 删除评论
export const deleteFlawComment = async (
  params: API.Flaw.DeleteFlawComment.Params,
) => {
  await http.delete<any>('deleteFlawComment', {
    project_id: params.projectId,
    id: params.id,
  })
}

// 编辑评论
export const updateFlawComment = async (
  params: API.Flaw.UpdateFlawComment.Params,
) => {
  await http.post<any>('updateFlawComment', {
    project_id: params.projectId,
    story_id: params.storyId,
    content: params.content,
    a_user_ids: params.ids,
    id: params.id,
  })
}

// 缺陷变更记录
export const getFlawChangeLog = async (
  params: API.Flaw.GetFlawChangeLog.Params,
) => {
  const response = await http.get<any, API.Flaw.GetFlawChangeLog.Result>(
    'getFlawChangeLog',
    {
      search: {
        story_id: params.id,
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

// 缺陷流转记录
export const getFlawStatusLog = async (
  params: API.Flaw.GetFlawStatusLog.Params,
) => {
  const response = await http.get<any>('getFlawStatusLog', {
    search: {
      story_id: params.id,
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

// 添加缺陷详情关联
export const addInfoFlaw = async (params: API.Flaw.AddInfoFlaw.Params) => {
  await http.put<any>('addInfoFlaw', {
    project_id: Number(params.projectId),
    id: Number(params.id),
    target: params.targetId,
    type: params.type,
  })
}

// 删除缺陷详情关联
export const deleteInfoFlaw = async (params: API.Flaw.AddInfoFlaw.Params) => {
  await http.put<any>('deleteInfoFlaw', {
    project_id: Number(params.projectId),
    id: Number(params.id),
    target_id: params.targetId,
    type: params.type,
  })
}

// 快捷修改参数
export const updateFlawTableParams = async (params: any) => {
  await http.put<any>('changeFlawTableParams', {
    project_id: params.projectId,
    id: params.id,
    ...params.otherParams,
  })
}

// 修改优先级
export const updateFlawPriority = async (
  params: API.Flaw.UpdateFlawPriority.Params,
) => {
  await http.put<any>('updateFlawPriority', {
    priority: params.priorityId,
    id: params.id,
    project_id: params.projectId,
  })
}

// 修改缺陷类型
export const updateFlawCategory = async (
  params: API.Flaw.UpdateFlawCategory.Params,
) => {
  await http.put<any>('updateFlawCategory', {
    project_id: params.projectId,
    story_id: params.id,
    category_id: params.categoryId,
    status_id: params.statusId,
  })
}

// 修改缺陷状态
export const updateFlawStatus = async (
  params: API.Flaw.UpdateFlawStatus.Params,
) => {
  delete params.fields.reviewerValue
  await http.put<any>('updateFlawStatus', {
    project_id: params.projectId,
    story_id: params.nId,
    category_status_to_id: params.toId,
    fields: params.fields,
    verify_user_id: params.verifyId ?? undefined,
  })
}

export const getLoadFlawListFields = async (
  params: API.Flaw.GetLoadFlawListFields.Params,
) => {
  const response: any = await http.get<
    any,
    API.Flaw.GetLoadFlawListFields.Result
  >('getLoadFlawListFields', {
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

// 导出缺陷字段列表
export const getExportFlawFields = async (params: { projectId: number }) => {
  const response: any = await http.get<
    any,
    API.Flaw.GetLoadFlawListFields.Result
  >('getExportFlawFields', {
    project_id: params.projectId,
  })

  return {
    baseFields: response.data.base_fields,
    timeAndPersonFields: response.data.time_person_fields,
    customFields: response.data.custom_fields,
  }
}

// 获取下载模板
export const getImportDownloadFlawModel = async (
  params: API.Flaw.GetImportDownloadFlawModel.Params,
) => {
  const response = await http.get(
    'getImportDownloadFlawModel',
    {
      is_update: params.isUpdate,
      project_id: params.projectId,
      fields: params.fields,
    },
    { responseType: 'blob' },
  )

  return response
}

// 导入缺陷
export const getImportFlawExcel = async (
  params: API.Flaw.GetFlawExcel.Params,
) => {
  const formData = new FormData()
  formData.append('project_id', String(params.projectId))
  formData.append('file_path', params.filePath)
  const response = await http.post('getImportFlawExcel', formData, {
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
export const getImportFlawExcelUpdate = async (
  params: API.Flaw.GetFlawExcel.Params,
) => {
  const formData = new FormData()
  formData.append('project_id', String(params.projectId))
  formData.append('file_path', params.filePath)
  const response = await http.post('getImportFlawExcelUpdate', formData, {
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

// 导出缺陷
export const getExportFlawExcel = async (params: any) => {
  const response = await http.post(
    'getExportFlawExcel',
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
export const getFlawBatchEditConfig = async (
  params: API.Flaw.GetFlawBatchEditConfig.Params,
) => {
  const response: any = await http.get<
    any,
    API.Flaw.GetFlawBatchEditConfig.Result
  >('getBatchEditFlawConfig', {
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

// 缺陷批量删除
export const batchFlawDelete = async (
  params: API.Flaw.BatchFlawDelete.Params,
) => {
  await http.delete<any>('batchFlawDelete', {
    project_id: params.projectId,
    story_ids: params.demandIds,
    is_delete_childs: params.isDeleteChild,
  })
}

// 缺陷批量编辑
export const batchFlawEdit = async (params: API.Flaw.BatchFlawEdit.Params) => {
  await http.put<any>('batchFlawEdit', {
    project_id: params.projectId,
    story_ids: params.demandIds,
    type: params.type,
    target: params.target,
  })
}

// 编辑富文本
export const updateEditor = async (params: API.Flaw.UpdateEditor.Params) => {
  await http.put<any>('updateFlaw', {
    project_id: params.projectId,
    info: params.info,
    id: params.id,
    name: params.name,
  })
}

// 获取可流转的
export const getShapeFlawLeft = async (params: any) => {
  const res = await http.get('getShapeFlawLeft', {
    project_id: params.id,
    story_id: params.nId,
  })
  return res.data
}

// 可流转状态配置
export const getShapeFlawRight = async (params: any) => {
  const res = await http.get('getShapeFlawRight', {
    project_id: params.id,
    story_id: params.nId,
    category_status_from_id: params.fromId,
    category_status_to_id: params.toId,
  })

  const selectData = res.data.fieldsFilterData
  // 公司
  const filterCompanyList = selectData.company_user

  // 处理人、抄送人

  const filterMemberList = selectData.project_member

  // console.log(filterMemberList, '处理人、抄送人')

  // 分类

  const treeData = [
    {
      name: '全部分类',
      key: 0,
      id: 0,
      pid: 1,
      parent_id: 0,
      story_count: res.data[0]?.story_count,
      children: [
        {
          key: -1,
          name: '未分类',
          pid: 0,
          id: -1,
          story_count: res.data[1]?.story_count,
        },
        ...(transData(
          selectData.class ? selectData.class : [],
          'id',
          'parent_id',
          'children',
        ) ?? []),
      ],
    },
  ]
  const filterTreeList = filterTreeData(treeData)

  // 迭代

  const filterIterateList = selectData.iterate_name

  // 标签

  const filterGetTagList = selectData.tag?.map((i: any) => ({
    id: i.id,
    name: i.content,
  }))

  // console.log(filterGetTagList, '标签')

  // 优先级

  const filterGetPriOrStu = selectData.priority?.map((i: any) => ({
    id: i.id,
    name: i.content,
  }))

  // console.log(filterGetPriOrStu, '优先级')

  const filterFieldsList = res.data.fields.map((item: any, index: number) => {
    if (item.title.includes('时间') && !item.attr) {
      return {
        ...item,
        id: index,
        name: item.title,
        key: item.content,
        content: item.content,
        type: 'time',
      }
    } else if (item.content.includes('users_name') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: [...filterMemberList],
        type: 'select_checkbox',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('users_copysend_name') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: [...filterCompanyList],
        type: 'select_checkbox',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('class') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: filterTreeList,
        type: 'tree',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('iterate_name') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: filterIterateList,
        type: 'select',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('tag') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: filterGetTagList,
        type: 'tag',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('priority') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: filterGetPriOrStu,
        type: 'select',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.title.includes('需求进度') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: item.values,
        type: 'number',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('comment') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: item.values,
        type: 'area',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.attr) {
      if (item.attr === 'date') {
        return {
          ...item,
          id: index,
          name: item.title,
          key: item.content,
          content: item.content,
          dvalue: item.true_value,
          type: item.value[0],
        }
      }

      // 这里操作人员

      if (item.attr === 'user_select') {
        if (item.value[0] === 'projectMember') {
          return {
            ...item,
            id: index,
            name: item.title,
            key: item.content,
            content: item.content,
            dvalue: item.true_value,
            type: 'select',
            children: [...filterMemberList],
          }
        }
        if (item.value[0] === 'companyMember') {
          return {
            ...item,
            id: index,
            name: item.title,
            key: item.content,
            content: item.content,
            dvalue: item.true_value,
            type: 'select',
            children: [...filterCompanyList],
          }
        }
      }
      if (item.attr === 'user_select_checkbox') {
        if (item.value[0] === 'projectMember') {
          return {
            ...item,
            id: index,
            name: item.title,
            key: item.content,
            content: item.content,
            dvalue: item.true_value,
            type: 'select_checkbox',
            children: [...filterMemberList],
          }
        }
        if (item.value[0] === 'companyMember') {
          return {
            ...item,
            id: index,
            name: item.title,
            key: item.content,
            content: item.content,
            dvalue: item.true_value,
            type: 'select_checkbox',
            children: [...filterCompanyList],
          }
        }
      }
      return {
        ...item,
        id: index,
        name: item.title,
        key: item.content,
        content: item.content,
        type: item.attr,
        dvalue: item.true_value,
        children: item?.value
          ? item?.value?.map((k: any) => ({
              name: k,
              id: k,
            }))
          : [],
      }
    }

    return {
      ...item,
      id: index,
      name: item.title,
      key: item.content,
      content: item.content,

      type: 'select',
    }
  })

  const obj = {
    fields: filterFieldsList,
    verify: res.data.verify,
    is_verify: res.data.is_verify === 1,
    user_has_auth: res.data.user_has_auth,
    originalStatusUserIds: res.data.originalStatusUserIds,
  }
  return obj
}