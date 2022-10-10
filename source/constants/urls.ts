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
  getStaffList: '/b/user/list',
  editStaff: '/b/user/update',
  refreshStaff: '/b/user/update/refresh',
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
  userInfoAbeyanceStory: '/b/user/info/abeyance_story',
  userInfoFinishStory: '/b/user/info/finish_story',
  userInfoCreateStory: '/b/user/info/create_story',
  userInfoOverviewStatistics: '/b/user/info/overview_statistics',
  userInfoOverviewFeed: '/b/user/info/overview_feed',
  userInfoProject: '/b/user/info/project',
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
  getMemberGantt: '/b/user/info/overview_gantt_chart',
}

export default urls

export type Urls = typeof urls

export type UrlKeys = keyof Urls
