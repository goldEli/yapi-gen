/* eslint-disable @typescript-eslint/no-loss-of-precision */
import urls from '@/constants/urls'
import * as http from '@/tools/http'

export const getSprintKanBanList = async (
  params: API.Sprint.GetSprintKanBanList.Params,
) => {
  const response = await http.get<any, API.Sprint.GetSprintKanBanList.Result>(
    'getSprintKanBanList',
    params,
  )
  return response
}

// 获取权限
export const getProjectRoleList = async (
  params: API.Sprint.GetProjectRoleList.Params,
) => {
  const response = await http.get<any, API.Sprint.GetProjectRoleList.Result>(
    `/b/project/role?project_id=${params.project_id}`,
    params,
  )
  return response
}

// 修改权限角色
export const updateProjectRole = (
  params: API.Sprint.GetProjectRoleList.updateParams,
) => http.put<any, API.Sprint.GetProjectRoleList.Result>('updateMember', params)

// 修改项目首页配置
export const updateHomeSetting = (
  params: API.Sprint.UpdateHomeSetting.Params,
) =>
  http.put<any, API.Sprint.UpdateHomeSetting.Result>(
    'updateHomeSetting',
    params,
  )

// 处理事务列表数据
const getListItem = (array: any, params: API.Sprint.GetSprintList.Params) => {
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
export const getSprintSelectList = async (
  params: API.Sprint.GetSprintList.Params,
) => {
  const response = await http.get<any, API.Sprint.GetSprintList.SelectResult>(
    'getSprintList',
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
export const getSprintList = async (
  params: API.Sprint.GetSprintList.Params,
) => {
  const response = await http.get<any, API.Sprint.GetSprintList.Result>(
    'getSprintList',
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
export const getSprintInfo = async (
  params: API.Sprint.GetSprintInfo.Params,
) => {
  const response = await http.get<any, API.Sprint.GetSprintInfo.Result>(
    'getSprintInfo',
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
export const getSprintCommentList = async (
  params: API.Sprint.GetSprintCommentList.Params,
) => {
  const response: any = await http.get<
    any,
    API.Sprint.GetSprintCommentList.Params
  >('getSprintCommentList', {
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
export const addSprintComment = async (
  params: API.Sprint.AddSprintComment.Params,
) => {
  await http.post<any>('addSprintComment', {
    project_id: params.projectId,
    story_id: params.sprintId,
    content: params.content,
    attachment: params.attachment,
    a_user_ids: params.a_user_ids,
  })
}

// 删除评论
export const deleteSprintComment = async (
  params: API.Sprint.DeleteSprintComment.Params,
) => {
  await http.delete<any>('deleteSprintComment', {
    project_id: params.projectId,
    id: params.id,
  })
}

// 事务变更记录
export const getSprintChangeLog = async (
  params: API.Sprint.GetSprintChangeLog.Params,
) => {
  const response = await http.get<any, API.Sprint.GetSprintChangeLog.Result>(
    'getSprintChangeLog',
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
export const getSprintStatusLog = async (
  params: API.Sprint.GetSprintStatusLog.Params,
) => {
  const response = await http.get<any>('getSprintStatusLog', {
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
export const addInfoSprint = async (
  params: API.Sprint.AddInfoSprint.Params,
) => {
  await http.put<any>('addInfoSprint', {
    project_id: Number(params.projectId),
    id: Number(params.sprintId),
    target: params.targetId,
    type: params.type,
  })
}

// 删除事务详情关联
export const deleteInfoSprint = async (
  params: API.Sprint.AddInfoSprint.Params,
) => {
  await http.put<any>('deleteInfoSprint', {
    project_id: Number(params.projectId),
    id: Number(params.sprintId),
    target_id: params.targetId,
    type: params.type,
  })
}

// 快捷修改参数
export const updateSprintTableParams = async (params: any) => {
  await http.put<any>('changeSprintTableParams', {
    project_id: params.projectId,
    id: params.id,
    ...params.otherParams,
  })
}

// 修改优先级
export const updateSprintPriority = async (
  params: API.Sprint.UpdateSprintPriority.Params,
) => {
  await http.put<any>('updateSprintPriority', {
    priority: params.priorityId,
    id: params.sprintId,
    project_id: params.projectId,
  })
}

// 修改事务类型
export const updateSprintCategory = async (
  params: API.Sprint.UpdateSprintCategory.Params,
) => {
  await http.put<any>('updateSprintCategory', {
    project_id: params.projectId,
    story_id: params.sprintId,
    category_id: params.categoryId,
    status_id: params.statusId,
  })
}

// 完成率Top10
export const getCompletionRate = async (
  params: API.Sprint.GetCompletionRate.Params,
) => {
  const response = await http.get<any, API.Sprint.GetCompletionRate.Result>(
    'getCompletionRate',
    params,
  )
  return response.data
}
// 阶段缺陷占比
export const getDefectRatio = async (
  params: API.Sprint.GetDefectRatio.Params,
) => {
  const response = await http.get<any, API.Sprint.GetDefectRatio.Result>(
    'getDefectRatio',
    params,
  )
  return response.data
}
// 缺陷趋势
export const getBugList = async (params: API.Sprint.GetDefectRatio.Params) => {
  const response = await http.get<any, API.Sprint.GetDefectRatio.Result>(
    'getDefectRatio',
    params,
  )
  return response.data
}
// 工作项和缺陷
export const getStatisticsTotal = async (
  params: API.Sprint.GetDefectRatio.Params,
) => {
  const response = await http.get<any, API.Sprint.GetStatisticsTotal.Result>(
    'getDefectRatio',
    params,
  )
  return response.data
}
// 检查是否保存视图
export const checkUpdates = async (params: API.Sprint.CheckUpdate.Params) => {
  const response = await http.post('checkUpdate', params)
  return response.data
}

// 分享视图
export const shareView = async (params: API.Sprint.GetDefectRatio.Params) => {
  const response = await http.post<any, API.Sprint.GetStatisticsTotal.Result>(
    'shareView',
    params,
  )
  return response.data
  // const response = await http.get<any, API.Sprint.GetStatisticsTotal.Result>(
  //   `getDefectRatio`,
  //   params,
  // )
  return {
    work: [
      {
        name: '完成率',
        value: 50,
        unit: '%',
        icon: 'https://agile.ifun.com/',
      },
      {
        name: '新增工作项',
        value: 40,
        unit: '项',
        icon: 'https://agile.ifun.com/',
      },
      {
        name: '已完成工作项',
        value: 20,
        unit: '项',
        icon: 'https://agile.ifun.com/',
      },
      {
        name: '工作项存量',
        value: 200,
        unit: '项',
        icon: 'https://agile.ifun.com/',
      },
      {
        name: '存量风险',
        value: 10,
        unit: '项',
        icon: 'https://agile.ifun.com/',
      },
    ],
    defect: [
      {
        name: '缺陷修复率',
        value: 60,
        unit: '%',
        icon: 'https://agile.ifun.com/',
      },
      {
        name: '待修复',
        value: 20,
        unit: '项',
        icon: 'https://agile.ifun.com/',
      },
      {
        name: '修复中',
        value: 20,
        unit: '项',
        icon: 'https://agile.ifun.com/',
      },
      {
        name: '已完成',
        value: 60,
        unit: '项',
        icon: 'https://agile.ifun.com/',
      },
      {
        name: '缺陷存量',
        value: 120,
        unit: '项',
        icon: 'https://agile.ifun.com/',
      },
    ],
  }
}

// 对比列表
export const workContrastList = async (
  params: API.Sprint.GetDefectRatio.Params,
) => {
  // const response = await http.get<any, API.Sprint.WorkContrastList.Result>(
  //   'workContrastList',
  //   params,
  // )
  const list = [
    {
      user: {
        id: 1,
        name: '张三',
        department_id: 1542079930036355073,
        job_id: 1542079890593120258,
        avatar:
          'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
        department: {
          id: 1542079930036355073,
          name: '总经办',
        },
        position: {
          id: 1542079890593120258,
          name: '总助ds',
        },
      },
      completion_rate: '50%',
      new: 40,
      completed: 20,
      work_stock: 200,
      work_progress: '10|30 33%',
      repeat_rate: '50%',
      risk: 10,
    },
    {
      user: {
        id: 2,
        name: '李四',
        department_id: 1542079930036355073,
        job_id: 1542079890593120258,
        avatar:
          'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
        department: {
          id: 1542079930036355073,
          name: 'php小组',
        },
        position: {
          id: 1542079890593120258,
          name: 'php工程师',
        },
      },
      completion_rate: '50%',
      new: 40,
      completed: 20,
      work_stock: 200,
      work_progress: '10|30 33%',
      repeat_rate: '50%',
      risk: 10,
    },
  ]
  return {
    work: [
      {
        name: '总完成率',
        value: 50,
        unit: '%',
      },
      {
        name: '当期新增',
        value: 40,
        unit: '项',
      },
      {
        name: '当期已完成',
        value: 20,
        unit: '项',
      },
      {
        name: '总工作存量',
        value: 200,
        unit: '项',
      },
      {
        name: '存量风险',
        value: 10,
        unit: '项',
      },
    ],
    pager: {
      total: 155,
      page: 1,
      pagesize: 20,
    },
    list: list.map(el => ({
      id: el.user.id,
      userName: el.user.name,
      departmentName: el.user.department.name,
      positionName: el.user.position.name,
      completion_rate: el.completion_rate,
      new: el.new,
      completed: el.completed,
      work_stock: el.work_stock,
      work_progress: el.work_progress,
      repeat_rate: el.repeat_rate,
      risk: el.risk,
    })),
  }
}
// 缺陷分析列表
export const memberBugList = async (
  params: API.Sprint.GetDefectRatio.Params,
) => {
  // const response = await http.get<any, API.Sprint.MemberBugList.Result>(
  //   'memberBugList',
  //   params,
  // )
  const res = {
    list: [
      {
        user: {
          id: 1,
          name: '张三',
          department_id: 1542079930036355073,
          job_id: 1542079890593120258,
          avatar:
            'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
          department: {
            id: 1542079930036355073,
            name: '总经办',
          },
          position: {
            id: 1542079890593120258,
            name: '总助ds',
          },
        },
        completion_rate: '50%',
        not_fixed: 20,
        fixing: 20,
        fixed: 60,
        repeat_open_rate: '10|20 50%',
        stock_risk: 5,
      },
      {
        user: {
          id: 2,
          name: '李四',
          department_id: 1542079930036355073,
          job_id: 1542079890593120258,
          avatar:
            'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504306850059784194/2022-10-12/images.jpg',
          department: {
            id: 1542079930036355073,
            name: '总经办',
          },
          position: {
            id: 1542079890593120258,
            name: '总助ds',
          },
        },
        completion_rate: '50%',
        not_fixed: 20,
        fixing: 20,
        fixed: 60,
        repeat_open_rate: '10|20 50%',
        stock_risk: 5,
      },
    ],
  }
  return {
    list: res.list.map(el => ({
      id: el.user.id,
      userName: el.user.name,
      departmentName: el.user.department.name,
      positionName: el.user.position.name,
      completion_rate: el.completion_rate,
      not_fixed: el.not_fixed,
      fixing: el.fixing,
      fixed: el.fixed,
      repeat_open_rate: el.repeat_open_rate,
      stock_risk: el.stock_risk,
    })),
    pager: {
      total: 155,
      page: 1,
      pagesize: 20,
    },
    defect: [
      {
        name: '缺陷修复率',
        value: 60,
        unit: '%',
      },
      {
        name: '待修复',
        value: 20,
        unit: '项',
      },
      {
        name: '修复中',
        value: 20,
        unit: '项',
      },
      {
        name: '已完成',
        value: 60,
        unit: '项',
      },
      {
        name: '缺陷存量',
        value: 120,
        unit: '项',
      },
      {
        name: '缺陷重开率',
        value: 33,
        unit: '%',
      },
      {
        name: '存量风险',
        value: 30,
        unit: '项',
      },
    ],
  }
}
export const plugSelectionUserInfo = async (params: { id: number }) => {
  // const response = await http.get<any, API.Sprint.PlugSelectionUserInfo.Result>(
  //   `b/efficiency/member/${params.id}/search/info`,
  //   params,
  // )
  const res = {
    id: 1,
    name: '张三',
    department_id: 1542079930036355073,
    job_id: 1542079890593120258,
    avatar: 'g',
    department: {
      id: 1542079930036355073,
      name: '总经办',
    },
    position: {
      id: 1542079890593120258,
      name: '总助ds',
    },
    status: [
      {
        id: 11462,
        content: '规划中',
      },
      {
        id: 11463,
        content: '实现中',
      },
      {
        id: 11464,
        content: '已完成',
      },
    ],
  }
  return {
    userInfo: {
      id: res.id,
      name: res.name,
      departmentName: res.department.name,
      positionName: res.position.name,
      avatar: res.avatar,
    },
    status: res.status.map(el => ({ label: el.content, value: el.id })),
  }
}
