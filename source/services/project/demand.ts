/* eslint-disable no-undefined */
/* eslint-disable no-negated-condition */
/* eslint-disable complexity */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '@/tools/http'

export const updateDemandStatus: any = async (params: any) => {
  await http.put<any>('updateDemandStatus', {
    project_id: params.projectId,
    story_id: params.nId,
    category_status_to_id: params.toId,
    fields: params.fields,
    verify_user_id: params.verifyId ?? undefined,
  })
}

export const getDemandInfo: any = async (params: any) => {
  const response: any = await http.get<any>('getDemandInfo', {
    project_id: params.projectId,
    id: params.id,
  })
  return {
    id: response.data.id,
    name: response.data.name || '--',
    info: response.data.info,
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
    'class': response.data.class_id,
    className: response.data.class,
  }
}

export const getDemandList: any = async (params: any) => {
  const response: any = await http.get<any>('getDemandList', {
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
    },
    pagesize: params?.pageSize,
    page: params?.page,
    orderkey: params?.orderKey,
    order: params?.order,
  })

  if (params.all && params.panel) {
    return {
      list: response.data.map((k: any) => ({
        count: k.count,
        list: k.list.map((i: any) => ({
          childCount: i.child_story_count,
          id: i.id,
          name: i.name,
          userName: i.users_name ? i.users_name.split(',') : [],
          priority: i.priority,
          status: i.status,
          category: i.category,
          categoryColor: i.category_color,
          project_id: i.project_id,
          usersNameIds: i.users_name_ids,
        })),
        name: k.content_txt,
        id: k.status_id,
      })),
    }
  } else if (params.all) {
    return response.data.map((i: any) => ({
      id: i.id,
      name: i.name,
      usersNameIds: i.users_name_ids,
      userName: i.users_name?.split(',') || [],
      status: i.status,
      iteration: i.iterate_name || '--',
      schedule: i.schedule,
    }))
  } else {
    return {
      currentPage: params.page,
      total: response.data.pager.total,
      list: response.data.list.map((i: any) => ({
        id: i.id,
        name: i.name,
        demand: i.child_story_count,
        priority: i.priority,
        iteration: i.iterate_name || '--',
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
        'class': i.class,
        schedule: i.schedule,
        ...i.custom_field,
        categoryColor: i.category_color,
        categoryRemark: i.category_remark,
        project_id: i.project_id,
        usersNameIds: i.users_name_ids,
      })),
    }
  }
}

export const getDemandChangeLog: any = async (params: any) => {
  const response: any = await http.get<any>('getDemandChangeLog', {
    search: {
      story_id: params.demandId,
      project_id: params.projectId,
    },
    pagesize: params.pageSize,
    page: params.page,
    orderkey: params.orderKey,
    order: params.order,
  })
  return {
    currentPage: params.page,
    total: response.data.pager.total,
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

export const getCommentList: any = async (params: any) => {
  const response: any = await http.get<any>('getCommentList', {
    search: {
      story_id: params.demandId,
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
    })),
  }
}

export const addComment: any = async (params: any) => {
  await http.post<any>('addComment', {
    project_id: params.projectId,
    story_id: params.demandId,
    content: params.content,
  })
}

export const deleteComment: any = async (params: any) => {
  await http.delete<any>('deleteComment', {
    project_id: params.projectId,
    id: params.id,
  })
}

export const addDemand: any = async (params: any) => {
  const element = document.createElement('div')
  element.innerHTML = params?.info
  const hasImg = Array.from(element.getElementsByTagName('img'))
  const info = hasImg.length
    ? params?.info
    : element.innerText.trim() === ''
      ? ''
      : element.innerHTML

  await http.post<any>('addDemand', {
    project_id: Number(params.projectId),
    name: params.name,
    info,
    expected_start_at: params?.expectedStart,
    expected_end_at: params?.expectedEnd,
    iterate_id: params?.iterateId,
    parent_id: params?.parentId,
    priority: params?.priority,
    users: params?.userIds,
    copysend: params?.copySendIds,
    tag: params?.tagIds,
    attachment: params?.attachments,
    custom_field: params?.customField,
    category_id: params?.category,
    class_id: params?.class,
    schedule: params?.schedule,
  })
}

export const updateDemand: any = async (params: any) => {
  const element = document.createElement('div')
  element.innerHTML = params?.info
  const hasImg = Array.from(element.getElementsByTagName('img'))
  const info = hasImg.length
    ? params?.info
    : element.innerText.trim() === ''
      ? ''
      : element.innerHTML
  await http.put<any>('updateDemand', {
    project_id: params.projectId,
    name: params.name,
    info,
    expected_start_at: params.expectedStart,
    expected_end_at: params.expectedEnd,
    iterate_id:
      JSON.stringify(params.iterateId) !== '[]' && params.iterateId
        ? params.iterateId
        : null,
    parent_id:
      JSON.stringify(params.parentId) !== '[]' && params.parentId
        ? params.parentId
        : null,
    priority:
      JSON.stringify(params.priority) !== '[]' && params.priority
        ? params.priority
        : null,
    users: params.userIds,
    copysend: params.copySendIds,
    tag: params.tagIds,
    attachment: params.attachments,
    id: params.id,
    custom_field: params?.customField,
    class_id: params?.class,
    schedule: params?.schedule,
  })
}

export const deleteDemand: any = async (params: any) => {
  await http.post<any>('deleteDemand', {
    project_id: params.projectId,
    id: params.id,
  })
}

export const deleteInfoDemand: any = async (params: any) => {
  await http.put<any>('deleteInfoDemand', {
    project_id: Number(params.projectId),
    id: Number(params.demandId),
    target_id: params.targetId,
    type: params.type,
  })
}

export const addInfoDemand: any = async (params: any) => {
  await http.put<any>('addInfoDemand', {
    project_id: Number(params.projectId),
    id: Number(params.demandId),
    target: params.targetId,
    type: params.type,
  })
}

export const updatePriority: any = async (params: any) => {
  await http.put<any>('updatePriority', {
    priority: params.priorityId,
    id: params.demandId,
    project_id: params.projectId,
  })
}

export const updateTableParams: any = async (params: any) => {
  await http.put<any>('changeTableParams', {
    project_id: params.projectId,
    id: params.id,
    ...params.otherParams,
  })
}

export const updateDemandCategory: any = async (params: any) => {
  await http.put<any>('updateDemandCategory', {
    project_id: params.projectId,
    story_id: params.id,
    category_id: params.categoryId,
    status_id: params.statusId,
  })
}

export const getStoryStatusLog: any = async (params: any) => {
  const response: any = await http.get<any>('getStoryStatusLog', {
    search: {
      story_id: params.demandId,
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
    statusTo: i.statusto
      ? {
          color: i.statusto?.color,
          name: i.statusto?.content,
        }
      : null,
    changeType: i.change_type,
    fields: {
      tag: i.fields?.tag,
      'class': i.fields?.class,
      comment: i.fields?.comment,
      priority: i.fields?.priority,
      usersName: i.fields?.users_name,
      iterateName: i.fields?.iterate_name,
      customFields: i.fields?.custom_field,
      startTime: i.fields?.expected_start_at,
      endTime: i.fields?.expected_end_at,
      copySendName: i.fields?.users_copysend_name,
    },
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

export const getLoadListFields: any = async (params: any) => {
  const response: any = await http.get<any>('getLoadListFields', {
    project_id: params.projectId,
    is_update: params.isUpdate,
  })

  return {
    baseFields: response.data.base_fields,
    timeAndPersonFields: response.data.time_person_fields,
    customFields: response.data.custom_fields,
  }
}

export const getImportDownloadModel: any = async (params: any) => {
  const response = await http.get(
    'getImportDownloadModel',
    {
      is_update: params.isUpdate,
      project_id: params.projectId,
      fields: params.fields,
    },
    { responseType: 'blob' },
  )

  return response
}

export const getImportExcel: any = async (params: any) => {
  const formData = new FormData()
  formData.append('project_id', params.projectId)
  formData.append('file_path', params.filePath)
  const response = await http.post('getImportExcel', formData, {
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

export const getImportExcelUpdate: any = async (params: any) => {
  const formData = new FormData()
  formData.append('project_id', params.projectId)
  formData.append('file_path', params.filePath)
  const response = await http.post('getImportExcelUpdate', formData, {
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
