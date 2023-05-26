const urls = {
  getCosSign: import.meta.env.__COS_SIGN_URL__,
  getCompanyInfo: '/b/company/info',
  getOperateLogs: '/b/company/operate_logs',
  getLoginLogs: '/b/company/login_logs',
  getRoleList: '/b/company/role',
  getRolePermission: '/b/company/role_get_permission',
  setRolePermission: '/b/company/role_set_permission',
  addRole: '/b/company/role',
  getProjectList: '/b/project/getlist',
  getTagList: '/b/project/getTags',
  getProjectCoverList: '/b/project/getCovers',
  getProjectInfo: '/b/project/getinfo',
  addProject: '/b/project/save',
  updateProject: '/b/project/update',
  deleteProject: '/b/project/delete',
  openProject: '/b/project/start',
  stopProject: '/b/project/stop',
  getProjectMember: '/b/project/member/getList',
  addProjectMember: '/b/project/member/save',
  updateMember: '/b/project/member/update',
  batchUpdateMember: '/b/project/member/update_batch',
  deleteMember: '/b/project/member/delete',
  getProjectPermission: '/b/project/role',
  addPermission: '/b/project/role',
  getPermission: '/b/project/role_get_project_permission',
  setPermission: '/b/project/role_set_project_permission',
  getIterateList: '/b/iterate/getList',
  addIterate: '/b/iterate/store',
  editIterate: '/b/iterate/update',
  deleteIterate: '/b/iterate/del',
  getIterateInfo: '/b/iterate/getInfo',
  getIterateChangeLog: '/b/iterate/getChangelog',
  updateIterateStatus: '/b/iterate/status',
  iterateStatistics: '/b/iterate/getStatistics',
  updateDemandStatus: '/b/story/update_status',
  getDemandInfo: '/b/story/getinfo',
  getDemandList: '/b/story/getlist',
  getDemandChangeLog: '/b/story/getchangelog',
  getCommentList: '/b/story/comment/getlist',
  addComment: '/b/story/comment/save',
  deleteComment: '/b/story/comment/delete',
  addDemand: '/b/story/save',
  updateDemand: '/b/story/update',
  deleteDemand: '/b/story/delete',
  deleteInfoDemand: '/b/story/update_operate/del',
  addInfoDemand: '/b/story/update_operate/add',
  updatePriority: '/b/story/update_priority',
  getLoginDetail: '/b/userinfo',
  loginOut: '/b/logout',
  getUserDetail: '/b/userdetail',
  getCompanyList: '/b/user_companys',
  changeCompany: '/b/user_change_company',
  getStaffList: '/b/companyuser/list',
  editStaff: '/b/companyuser/update',
  batchEditStaff: '/b/companyuser/update_batch',
  refreshStaff: '/b/companyuser/update/refresh',
  getDepartmentSelectList: '/b/user/department/list',
  getPositionSelectList: '/b/user/position/list',
  getGlobalGeneral: '/b/company/statistics',
  getMineProjectList: '/b/user/project',
  getMineGatte: '/b/user/overview/gantt/chart',
  getUserFeedList: '/b/user/overview/feed',
  getMineNeedList: '/b/user/copysend/story',
  getMineNoFinishList: '/b/user/abeyance/story',
  getMineFinishList: '/b/user/finish/story',
  getMineChartsList: '/b/user/overview/statistics',
  getMineCreacteList: '/b/user/create/story',
  getPriOrStu: '/b/project/getconfig',
  addQuicklyCreate: '/b/user/fast/create',
  storyConfigField: '/b/project/story_config/field',
  getStatusList: '/b/project/story_config/status',
  getCategoryList: '/b/project/story_config/category/list',
  // 新增类别
  addCategory: '/b/project/story_config/category/add',
  updateCategory: '/b/project/story_config/category/edit',
  deleteCategory: '/b/project/story_config/category/delete',
  changeCategoryStatus: '/b/project/story_config/category/change/status',
  moveCategoryStory: '/b/project/story_config/category/change/story',
  getWorkflowList: '/b/project/story_config/workflow',
  dragWorkflow: '/b/project/story_config/workflow/sortchange',
  saveWorkflowStatus: '/b/project/story_config/workflow_config/save',
  getWorkflowInfo: '/b/project/story_config/workflow_config/info',
  saveWorkflowConfig: '/b/project/story_config/workflow_config/setInfo',
  getNeedTreeList: '/b/project/story/class/list',
  addNeedTreeList: '/b/project/story/class/add',
  editNeedTreeList: '/b/project/story/class/edit',
  delNeedTreeList: '/b/project/story/class/delete',
  moveNeedTreeList: '/b/project/story/class/move',
  changeTableParams: '/b/story/update_fast',
  getShapeLeft: '/b/story/get_can_changes_workflows',
  getShapeRight: '/b/story/get_workflows_config',
  updateDemandCategory: '/b/story/update/category',
  userInfoAbeyanceStory: '/b/companyuser/info/abeyance_story',
  userInfoFinishStory: '/b/companyuser/info/finish_story',
  userInfoCreateStory: '/b/companyuser/info/create_story',
  userInfoOverviewStatistics: '/b/companyuser/info/overview_statistics',
  userInfoOverviewFeed: '/b/companyuser/info/overview_feed',
  userInfoProject: '/b/companyuser/info/project',
  memberInfoAbeyanceStory: '/b/project/member/info/abeyance_story',
  memberInfoFinishStory: '/b/project/member/info/finish_story',
  memberInfoCreateStory: '/b/project/member/info/create_story',
  memberInfoOverviewStatistics: '/b/project/member/info/overview_statistics',
  memberInfoProject: '/b/project/member/info/project',
  getStoryStatusLog: '/b/story/getstatuslog',
  getVerifyUserList: '/b/user/verifyuser/list',
  getVerifyList: '/b/user/verify/list',
  updateVerifyOperation: '/b/user/verify/operation',
  getLoadListFields: '/b/story/load_list_fields',
  getImportDownloadModel: '/b/story/download_story_model',
  getImportExcel: '/b/story/import_story_excel',
  getImportExcelUpdate: '/b/story/import_story_update_excel',
  getMemberGantt: '/b/project/member/info/overview_gantt_chart',
  getUserGantt: '/b/companyuser/info/overview_gantt_chart',
  getExportExcel: '/b/story/export_story_excel',
  getAchieveInfo: '/b/iterate/achieve/info',
  updateAchieve: '/b/iterate/achieve',
  getExportFields: '/b/story/get_story_export_fields',
  getDailyList: '/b/report/list',
  addDaily: '/b/report/add',
  editDaily: '/b/report/update',
  getReportDetail: '/b/report/info',
  getReportContent: '/b/report/comment/add',
  getReceiveList: '/b/report/copysend/list',
  getGroupList: '/b/project/getGroupList',
  addProjectGroup: '/b/project/group/save',
  updateProjectGroup: '/b/project/group/update',
  deleteProjectGroup: '/b/project/group/delete',
  batchDelete: '/b/story/batch_delete',
  batchEdit: '/b/story/batch_update',
  getBatchEditConfig: '/b/story/batch_fields',
  getMenuPermission: '/b/user_menu_list',
  getCompanyUserPreferenceConfig: '/b/preference/config',
  updateCompanyUserPreferenceConfig: '/b/preference/config',
  deleteCommentAttach: '/b/story/comment/delete_att',
  /**
   * 日历管理
   */
  saveSchedule: '/b/calendar/schedule',
  getScheduleList: '/b/calendar/schedule_list',
  getCalendarDaysOfYearList: '/b/calendar/schedule/daysOfYear',
  getCalendarDaysOfMonthList: '/b/calendar/schedule/daysOfMonth',
  getCalendarConfig: '/b/calendar/getConfig',
  updateCalendarConfig: '/b/calendar/setConfig',
  getRelateConfig: '/b/calendar/enum',
  addCalendar: '/b/calendar',
  getUserCalendars: '/b/calendar/getUserCalendars',
  getDaysOfWeekList: '/b/calendar/daysOfWeek',
  getContactsCalendarList: '/b/calendar/getContacts',
  getDaysOfMonthList: '/b/calendar/daysOfMonth',
  createTemplate: '/b/work_report/template/create',
  upDateTemplate: '/b/work_report/template/edit',
  templateDetail: '/b/work_report/template/info',
  deleteTemplate: '/b/work_report/template/delete',
  templateList: '/b/work_report/template/list',
  templateLatelyList: '/b/work_report/template/lately',
  writeReport: '/b/work_report/user',
  updateReport: '/b/work_report/user',
  statTempList: '/b/work_report/statistics/template/list',
  statUserList: '/b/work_report/statistics/user/list',
  statInfo: '/b/work_report/statistics/info',
  statTempUsage: '/b/work_report/statistics/template',
  supplyList: '/b/work_report/template/supply',
  getReportDetailById: '/b/work_report/user/info',
  repSentList: '/b/work_report/user/send/list',
  repReceivedList: '/b/work_report/user/receive/list',
  repPublicList: '/b/work_report/user/public/list',
  getReportInfo: '/b/work_report/user/info',
  getReportComment: '/b/work_report/user/comment',
  addReportComment: '/b/work_report/user/comment',
  supplyReport: '/b/work_report/user/supply',
  delReportComment: '/b/work_report/user/comment',
  getScheduleListDaysOfWeek: '/b/calendar/schedule/daysOfWeek',
  getScheduleListDaysOfMonth: '/b/calendar/schedule/daysOfMonth',
  getScheduleListDaysOfDate: '/b/calendar/schedule/daysOfDate',
  getScheduleSearch: '/b/calendar/schedule/search',

  getSprintKanBanList: '/b/list',
  // 事务列表
  getSprintList: '/b/transaction/getlist',
  // 事务详情
  getSprintInfo: '/b/transaction/getinfo',
  // 修改事务状态
  updateSprintStatus: '/b/transaction/update_status',
  // 事务变更记录
  getSprintChangeLog: '/b/transaction/getchangelog',
  // 事务评论列表
  getSprintCommentList: '/b/transaction/comment/getlist',
  // 添加评论
  addSprintComment: '/b/transaction/comment/save',
  // 删除评论
  deleteSprintComment: '/b/transaction/comment/delete',
  // 添加事务
  addSprint: '/b/transaction/save',
  // 更新事务
  updateSprint: '/b/transaction/update',
  // 删除事务
  deleteSprint: '/b/transaction/delete',
  // 删除详情关联
  deleteInfoSprint: '/b/transaction/update_operate/del',
  // 添加详情关联
  addInfoSprint: '/b/transaction/update_operate/add',
  // 修改事务优先级
  updateSprintPriority: '/b/transaction/update_priority',
  // 事务快捷修改
  changeSprintTableParams: '/b/transaction/update_fast',
  // 获取状态可流转列表
  getShapeSprintLeft: '/b/transaction/get_can_changes_workflows',
  // 获取相应状态下的配置
  getShapeSprintRight: '/b/transaction/get_workflows_config',
  // 修改事务类别
  updateSprintCategory: '/b/transaction/update/category',
  // 获取事务流转记录
  getSprintStatusLog: '/b/transaction/getstatuslog',
  // 获取导入下载模板字段列表
  getLoadSprintListFields: '/b/transaction/load_list_fields',
  // 下载导入事务模板
  getImportDownloadSprintModel: '/b/transaction/download_story_model',
  // 确认新建导入事务
  getImportSprintExcel: '/b/transaction/import_story_excel',
  // 确认更新导入事务
  getImportSprintExcelUpdate: '/b/transaction/import_story_update_excel',
  // 确认导出事务
  getExportSprintExcel: '/b/transaction/export_story_excel',
  // 获取导出事务字段列表
  getExportSprintFields: '/b/transaction/get_story_export_fields',
  // 批量删除事务
  batchSprintDelete: '/b/transaction/batch_delete',
  // 批量编辑事务
  batchSprintEdit: '/b/transaction/batch_update',
  // 批量编辑的下拉列表
  getBatchEditSprintConfig: '/b/transaction/batch_fields',
  // 删除评论下的附件
  deleteSprintCommentAttach: '/b/transaction/comment/delete_att',

  // 修改日程

  modifySchedule: function (id: Model.Schedule.Info['schedule_id']) {
    return `/b/calendar/schedule/${id}`
  },

  // 看板配置列表
  getKanbanConfigList: '/b/project/kanban/configs/index',
  // 看板配置
  getKanbanConfig: '/b/project/kanban/configs/show',
  // 创建看板配置
  createKanbanConfig: '/b/project/kanban/configs/create',
  // 修改看板配置
  updateKanbanConfig: '/b/project/kanban/configs/update',
  // 删除看板配置
  deleteKanbanConfig: '/b/project/kanban/configs/delete',
  // 看板配置剩余状态
  getKanbanConfigRemainingStatus: '/b/project/kanban/configs/residueStatus',
  // 完成率Top10
  getCompletionRate: '/b/efficiency/contrast/completion_rate',
  // 阶段缺陷占比
  getDefectRatio: '/b/efficiency/defect_ratio',
  // 缺陷趋势
  getBugList: '/b/efficiency/member/bug/list',
  // 工作项和缺陷
  getStatisticsTotal: '/b/efficiency/statistics/total',
  // 对比列表
  workContrastList: '/b/efficiency/member/work_contrast/list',
  // 缺陷分析列表
  memberBugList: '/b/efficiency/member/bug/list',
  // 修改首页配置
  updateHomeSetting: '/b/project/change/defaultHomeMenu',
  /**
   * 看板
   */
  // 看板查询
  getKanban: '/b/project/kanban/index',
  // 新增人员分组
  createKanbanPeopleGrouping: '/b/project/kanban/storeGroup',
  // 修改人员分组
  modifyKanbanPeopleGrouping: '/b/project/kanban/updateGroup',
  // 看板分组查询
  getKanbanByGroup: '/b/project/kanban/storiesOfGroupBy',
  // 修改看板事务顺序
  modifyKanbanIssueSort: '/b/project/kanban/updateSort',
  // 检查试图是否保存
  checkUpdate: '/b/story/views/checkUpdate',
  // 分享视图
  shareView: '/b/story/views/share',

  /**
   * 视图管理
   */
  // 获取视图列表
  getStoryViewList: '/b/story/views/list',
  // 更新视图
  updateView: '/b/story/views/update',
  // 新建视图
  createView: '/b/story/views/create',
  // 删除视图
  delView: '/b/story/views/delete',
}
export default urls

export type Urls = typeof urls

export type UrlKeys = keyof Urls
