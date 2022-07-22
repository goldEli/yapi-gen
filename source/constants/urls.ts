const urls = {
  getCosSign: 'https://www.ifunsms.com/api/622ad916aabae',
  getCompanyInfo: '/b/company/info',
  getOperateLogs: '/b/company/operate_logs',
  getLoginLogs: '/b/company/login_logs',
  getRoleList: '/b/company/role',
  getRolePermission: '/b/company/role_get_permission',
  setRolePermission: '/b/company/role_set_permission',
  addRole: '/b/company/role',
  getProjectList: '/b/project/getlist',

  getLoginDetail: '/b/userinfo', //yangyi
  loginOut: '/b/logout', //yangyi
  getUserDetail: '/b/userdetail', //yangyi
  getCompanyList: '/b/user_companys', //yangyi
  changeCompany: '/b/user_change_company', //yangyi
  getStaffList: '/b/user/list', //yangyi
  editStaff: '/b/user/update', //yangyi
  refreshStaff: '/b/user/refresh', //yangyi
  getDepartmentSelectList: '/b/user/department/list', //yangyi
  getPositionSelectList: '/b/user/position/list', //yangyi
  getGlobalGeneral: '/b/company/statistics', //yangyi
}

export default urls

export type Urls = typeof urls

export type UrlKeys = keyof Urls
