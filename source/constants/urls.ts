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
  /**
   * 冲刺项目-事务
   */
  // 事务列表
  getAffairsList: '/b/transaction/getlist',
  // 事务详情
  getAffairsInfo: '/b/transaction/getinfo',
  // 修改事务状态
  updateAffairsStatus: '/b/transaction/update_status',
  // 事务变更记录
  getAffairsChangeLog: '/b/transaction/getchangelog',
  // 事务评论列表
  getAffairsCommentList: '/b/transaction/comment/getlist',
  // 添加评论
  addAffairsComment: '/b/transaction/comment/save',
  // 删除评论
  deleteAffairsComment: '/b/transaction/comment/delete',
  // 编辑评论
  updateAffairsComment: '/b/transaction/comment/update',
  // 添加事务 --------------
  addAffairs: '/b/transaction/save',
  // 更新事务 --------------
  updateAffairs: '/b/transaction/update',
  // 删除事务
  deleteAffairs: '/b/transaction/delete',
  // 删除详情关联
  deleteInfoAffairs: '/b/transaction/update_operate/del',
  // 添加详情关联
  addInfoAffairs: '/b/transaction/update_operate/add',
  // 修改事务优先级
  updateAffairsPriority: '/b/transaction/update_priority',
  // 事务快捷修改
  changeAffairsTableParams: '/b/transaction/update_fast',
  // 获取状态可流转列表
  getShapeAffairsLeft: '/b/transaction/get_can_changes_workflows',
  // 获取相应状态下的配置
  getShapeAffairsRight: '/b/transaction/get_workflows_config',
  // 修改事务类别
  updateAffairsCategory: '/b/transaction/update/category',
  // 获取事务流转记录
  getAffairsStatusLog: '/b/transaction/getstatuslog',
  // 获取导入下载模板字段列表
  getLoadAffairsListFields: '/b/transaction/load_list_fields',
  // 下载导入事务模板
  getImportDownloadAffairsModel: '/b/transaction/download_story_model',
  // 确认新建导入事务
  getImportAffairsExcel: '/b/transaction/import_story_excel',
  // 确认更新导入事务
  getImportAffairsExcelUpdate: '/b/transaction/import_story_update_excel',
  // 确认导出事务
  getExportAffairsExcel: '/b/transaction/export_story_excel',
  // 获取导出事务字段列表
  getExportAffairsFields: '/b/transaction/get_story_export_fields',
  // 批量删除事务
  batchAffairsDelete: '/b/transaction/batch_delete',
  // 批量编辑事务
  batchAffairsEdit: '/b/transaction/batch_update',
  // 批量编辑的下拉列表
  getBatchEditAffairsConfig: '/b/transaction/batch_fields',
  // 子事务 - 下拉查询
  getAffairsSelectChildren: '/b/transaction/selectChildrenSearch',
  // 子事务 - 最近事务
  getAffairsSelectChildrenRecent: '/b/transaction/selectChildrenRecent',
  // 添加子事务
  addAffairsChild: '/b/transaction/addChild',
  // 子事务拖拽排序
  affairsChildDragSort: '/b/transaction/dragChildSort',
  // 子事务列表
  getAffairsChildList: '/b/transaction/children',
  // 关联事务 - 下拉查询
  getAffairsSelectRelationSearch: '/b/transaction/selectRelationSearch',
  // 关联事务 - 最近事务
  getAffairsSelectRelationRecent: '/b/transaction/selectRelationRecent',
  // 添加关联事务
  addAffairsRelation: '/b/transaction/addRelation',
  // 关联事务拖拽排序
  affairsRelationDragSort: '/b/transaction/dragRelationSort',
  // 关联事务列表
  getAffairsRelationStoriesList: '/b/transaction/relationStories',
  // 编辑视图
  viewsUpdate: '/b/story/views/update',
  // 新建视图
  createViewList: '/b/story/views/create',
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
  // 新增工作排行榜图标第一个
  contrastNewWork: '/b/efficiency/contrast/new_work',
  // 阶段缺陷占比图标最后一个
  getDefectRatio: '/b/efficiency/defect_ratio',
  // 工作项和缺陷
  getStatisticsTotal: '/b/efficiency/statistics/total',
  // 对比列表
  workContrastList: '/b/efficiency/member/work_contrast/list',
  // 缺陷分析列表
  memberBugList: '/b/efficiency/member/bug/list',
  // 2，3，5，图表汇总数
  statisticsOther: '/b/efficiency/statistics/other',
  // 进展对比后半截弹窗
  efficiencyMemberWorkList: '/b/efficiency/member/work_list',
  // 缺陷分析后半截
  efficiencyMemberDefectList: '/b/efficiency/member/defect_list',
  // 修改首页配置
  updateHomeSetting: '/b/project/change/defaultHomeMenu',
  // 视图列表
  viewsList: '/b/story/views/list',
  // 近期的冲刺项目
  recentCreateData: '/b/project/recentCreateData',
  // 导出
  export: 'b/efficiency/member/work_contrast/export',
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
   * 冲刺板块
   */
  // 获取按冲刺分组的事务列表
  getSprintGroupList: '/b/sprint/groupList',
  // 获取按冲刺分组的事务列表
  getLeftSprintList: '/b/sprint/getList',
  // 创建冲刺
  createSprint: '/b/sprint/store',
  // 获取冲刺详情
  getSprintDetail: '/b/sprint/getInfo',
  // 编辑冲刺
  updateSprintInfo: '/b/sprint/update',
  // 删除冲刺
  delSprintItem: '/b/sprint/del',
  // 获取事务
  getLongStoryList: '/b/transaction/getLongStory',
  // 完成冲刺
  completeSprint: '/b/sprint/finish',
  // 更换冲刺
  moveStory: '/b/sprint/moveStory',
  // 拖动排序
  sortStory: '/b/sprint/sort',
  // 长故事下拉列表
  getLongStory: '/b/transaction/getLongStory',
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
  // 设置为默认视图
  defaultView: 'b/story/views/default',

  /**
   * 迭代项目-缺陷
   */

  // 缺陷列表
  getFlawList: '/b/flaw/getlist',
  // 缺陷详情
  getFlawInfo: '/b/flaw/getinfo',
  // 修改缺陷状态
  updateFlawStatus: '/b/flaw/update_status',
  // 缺陷变更记录
  getFlawChangeLog: '/b/flaw/getchangelog',
  // 缺陷评论列表
  getFlawCommentList: '/b/flaw/comment/getlist',
  // 添加评论
  addFlawComment: '/b/flaw/comment/save',
  // 删除评论
  deleteFlawComment: '/b/flaw/comment/delete',
  // 编辑评论
  updateFlawComment: '/b/flaw/comment/update',
  // 添加缺陷
  addFlaw: '/b/flaw/save',
  // 更新缺陷
  updateFlaw: '/b/flaw/update',
  // 删除缺陷
  deleteFlaw: '/b/flaw/delete',
  // 删除详情关联
  deleteInfoFlaw: '/b/flaw/update_operate/del',
  // 添加详情关联
  addInfoFlaw: '/b/flaw/update_operate/add',
  // 修改缺陷优先级
  updateFlawPriority: '/b/flaw/update_priority',
  // 缺陷快捷修改
  changeFlawTableParams: '/b/flaw/update_fast',
  // 获取状态可流转列表
  getShapeFlawLeft: '/b/flaw/get_can_changes_workflows',
  // 获取相应状态下的配置
  getShapeFlawRight: '/b/flaw/get_workflows_config',
  // 修改缺陷类别
  updateFlawCategory: '/b/flaw/update/category',
  // 获取缺陷流转记录
  getFlawStatusLog: '/b/flaw/getstatuslog',
  // 获取导入下载模板字段列表
  getLoadFlawListFields: '/b/flaw/load_list_fields',
  // 下载导入缺陷模板
  getImportDownloadFlawModel: '/b/flaw/download_story_model',
  // 确认新建导入缺陷
  getImportFlawExcel: '/b/flaw/import_story_excel',
  // 确认更新导入缺陷
  getImportFlawExcelUpdate: '/b/flaw/import_story_update_excel',
  // 确认导出缺陷
  getExportFlawExcel: '/b/flaw/export_story_excel',
  // 获取导出缺陷字段列表
  getExportFlawFields: '/b/flaw/get_story_export_fields',
  // 批量删除缺陷
  batchFlawDelete: '/b/flaw/batch_delete',
  // 批量编辑缺陷
  batchFlawEdit: '/b/flaw/batch_update',
  // 批量编辑的下拉列表
  getBatchEditFlawConfig: '/b/flaw/batch_fields',
  // 删除缺陷评论附件
  deleteFlawCommentAttach: '/b/flaw/comment/delete_att',
  // 获取缺陷关联工作项
  getFlawRelationStories: '/b/flaw/relationStories',
  // 添加关联缺陷
  addFlawRelation: '/b/flaw/addRelation',

  // 获取需求流转配置
  getFlowConfig: '/b/story/flowConfig',
}
export default urls

export type Urls = typeof urls

export type UrlKeys = keyof Urls
