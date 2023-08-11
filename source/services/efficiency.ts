/* eslint-disable @typescript-eslint/no-loss-of-precision */
// 效能洞察
/* eslint-disable max-lines */
// 缺陷和对比接口 start
// 对比列表
import * as http from '../tools/http'
export const workContrastList = async (
  params: API.Sprint.WorkContrastList.Params,
) => {
  const response = await http.get<any, API.Sprint.WorkContrastList.Result>(
    'workContrastList',
    params,
  )
  const { data } = response
  return {
    ...data,
    list: data.list.map((el: any) => ({
      id: el.user.id,
      userName: el.user.name,
      departmentName: el.user.department?.name,
      positionName: el.user.position?.name,
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
  params: API.Sprint.MemberBugList.Params,
) => {
  const res = await http.get<any, API.Sprint.MemberBugList.Result>(
    'memberBugList',
    params,
  )
  return {
    ...res.data,
    list: res.data.list.map((el: any) => ({
      id: el.user.id,
      userName: el.user.name,
      departmentName: el.user.department?.name,
      positionName: el.user.position?.name,
      repeat_open_rate: el.repeat_open_rate,
      stock_risk: el.stock_risk,
      completion_rate: el.completion_rate,
      fixed: el.fixed,
      fixing: el.fixing,
      not_fixed: el.not_fixed,
      repeat_open: el.repeat_open,
      risk_stock_count: el.risk_stock_count,
      stock_count: el.stock_count,
    })),
  }
}
// 后半截弹窗顶部的详情
export const plugSelectionUserInfo = async (params: {
  user_id: number
  project_ids?: any
}) => {
  const response = await http.get<any, API.Sprint.PlugSelectionUserInfo.Result>(
    '/b/efficiency/member/search/info',
    params,
  )

  return {
    userInfo: {
      id: response.data.id,
      name: response.data.name,
      departments: response.data.departments,
      position: response.data.position,
      email: response.data.email,
      avatar: response.data.avatar,
    },
    status: response.data.status.map(el => ({
      label: el.content,
      value: el.content,
    })),
  }
}
// 进展对比后半截弹窗
export const efficiencyMemberWorkList = async (
  params: API.Sprint.EfficiencyMemberWorkList.Params,
) => {
  const response = await http.get<
    any,
    API.Sprint.EfficiencyMemberWorkList.Result
  >('efficiencyMemberWorkList', params)
  return {
    total: response.data.total,
    list: response.data.list.map(el => ({
      id: el.id,
      name: el.name,
      created_at: el.created_at,
      story_prefix_key: el.story_prefix_key,
      category_attachment: el.category_attachment,
      expected_start_at: el.expected_start_at,
      expected_end_at: el.expected_end_at,
      status: el.status,
      relate_users: el.relate_users,
      user: el.user,
      project_type: el.project_type,
      story_type: el.story_type,
      project_id: el.project_id,
      story_config_status: el.story_config_status,
    })),
  }
}
// 缺陷分析后半截
export const efficiencyMemberDefectList = async (
  params: API.Sprint.EfficiencyMemberWorkList.Params,
) => {
  const response = await http.get<
    any,
    API.Sprint.EfficiencyMemberWorkList.Result
  >(`efficiencyMemberDefectList`, params)

  return {
    total: response.data.total,
    list: response.data.list.map(
      (el: {
        id: any
        name: any
        created_at: any
        story_prefix_key: any
        category_attachment: any
        expected_start_at: any
        expected_end_at: any
        status: any
        relate_users: any
        user: any
        project_type: number
        story_type: number
        project_id: number
        story_config_status: any
      }) => ({
        id: el.id,
        name: el.name,
        created_at: el.created_at,
        story_prefix_key: el.story_prefix_key,
        category_attachment: el.category_attachment,
        expected_start_at: el.expected_start_at,
        expected_end_at: el.expected_end_at,
        status: el.status,
        relate_users: el.relate_users,
        user: el.user,
        project_type: el.project_type,
        story_type: el.story_type,
        project_id: el.project_id,
        story_config_status: el.story_config_status,
      }),
    ),
  }
}
// 工作项和缺陷的卡片
export const getStatisticsTotal = async (
  params: API.Sprint.GetStatisticsTotal.Params,
) => {
  const response = await http.get<any, API.Sprint.GetStatisticsTotal.Result>(
    'getStatisticsTotal',
    params,
  )
  return response.data
}
// 进展对比前半截
export const historyWorkList = async (
  params: API.Efficiency.HistoryWorkList.Params,
) => {
  const response = await http.get<any, API.Efficiency.HistoryWorkList.Result>(
    `/b/efficiency/member/${params.userId}/history/work_list`,
  )
  return response.data
}
// 缺陷分析的前半截
export const historyDefectList = async (
  params: API.Efficiency.HistoryWorkList.Params,
) => {
  const response = await http.get<any, API.Efficiency.HistoryDefectList.Result>(
    `/b/efficiency/member/${params.userId}/history/defect_list`,
  )
  return {
    ...response.data,
    work_record: response.data.defect_record,
    work: response.data.defect,
  }
}
// 缺陷和对比接口 end

// 视图的接口 start
// 视图的列表
export const viewsList = async (parmas: API.Efficiency.ViewsList.Params) => {
  const response = await http.get<any, API.Efficiency.ViewsList.Result>(
    'viewsList',
    parmas,
  )
  return response.data.map(el => ({
    id: el.id,
    name: el.name,
    label: el.name,
    status: el.status,
    type: el.type,
    config: el.config,
    key: String(el.id),
    is_default: el.is_default,
  }))
}
// 视图修改
export const viewsUpdate = async (
  parmas: API.Efficiency.ViewsEditList.Params,
) => {
  const response = await http.put<any, API.Efficiency.ViewsEditList.Result>(
    'viewsUpdate',
    parmas,
  )

  return response.data
}
// 视图新建
export const createViewList = async (
  parmas: API.Efficiency.ViewsEditList.Params,
) => {
  const response = await http.post<any, API.Efficiency.ViewsEditList.Result>(
    'createViewList',
    parmas,
  )
  return response.data
}
// 删除视图
export const delView = async (id: number) => {
  const response = await http.delete<any, API.Efficiency.ViewsEditList.Result>(
    'delView',
    { id },
  )
  return response.data
}
// 设置默认视图
export const defaultView = async (id: number) => {
  const response = await http.patch<any, API.Efficiency.ViewsEditList.Result>(
    'defaultView',
    { id },
  )
  return response.data
}
// 视图的接口 end

// 图表页面 start
// 新增工作top10对比
export const contrastNewWork = async (
  params: API.Sprint.contrastNewWork.Params,
) => {
  const response = await http.get<any, API.Sprint.contrastNewWork.Result>(
    'contrastNewWork',
    params,
  )
  return response.data
}
// 完成率Top10对比
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
// 2，3，5图表
export const statisticsOther = async (
  params: API.Efficiency.StatisticsOther.Params,
) => {
  const response = await http.get<any, API.Efficiency.StatisticsOther.Result>(
    'statisticsOther',
    params,
  )
  return response.data
}
// 图表页面 end
// 最近的冲刺项目
export const recentCreateData = async (params: {
  resource_type: number
  project_id: number
}) => {
  const response = await http.get<any, API.Sprint.RecentCreateData.Result>(
    'recentCreateData',
    params,
  )
  return response.data
}
export const getExport = async (parmas: API.Sprint.GetExport.Params) => {
  const response = await http.get<any>('export', parmas, {
    responseType: 'blob',
  })
  return response
}

export const defectExport = async (parmas: API.Sprint.GetExport.Params) => {
  const response = await http.get<any>('defectExport', parmas, {
    responseType: 'blob',
  })
  return response
}
// 未分配
export const unassignedList = async (
  parmas: API.Sprint.UnassignedList.Params,
) => {
  const response = await http.get<any>('unassignedList', parmas)
  // console.log(response)
  // response.data.list[0].project_type = 1
  // response.data.list[0].projectType = 1
  // response.data.list[0].isBug = 1
  // response.data.list[0].isExamine = true
  // response.data.list[0].project.permissions = {
  //   key: 'b/flaw/update',
  // }
  const list = response.data.list.map((el: any) => ({
    ...el,
    storyPrefixKey: el.story_prefix_key,
    projectId: el.project_id,
    category: el.project_category.name,
    categoryAttachment: el.category_attachment,
    isExamine: el?.verify_lock === 1,
    categoryConfigList: el.category_config_list,
    projectType: el.project_type,
    status: el.category_status,
    projectCategory: el.project_category,
    categoryStatus: el.category_status,
    usersNameIds: el.users_name_ids,
    workType: el.work_type,
    userName: el.user_name,
    userId: el.user_id,
    storyCount: el.story_count,
    isCanEdit: el.project?.permissions
      ? (el.project_type === 1 &&
          el.isBug === 1 &&
          Object.values(el.project?.permissions).includes('b/flaw/update')) ||
        (el.project_type === 2 &&
          Object.values(el.project?.permissions).includes(
            'b/transaction/update',
          )) ||
        (el.project_type === 1 &&
          el.isBug !== 1 &&
          Object.values(el.project?.permissions).includes('b/story/update'))
      : false,
  }))
  return {
    list,
    pager: response.data.pager,
  }
}
