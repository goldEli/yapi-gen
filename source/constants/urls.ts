const urls = {
  getCosSign: 'https://www.ifunsms.com/api/622ad916aabae',
  getCompanyInfo: '/b/company/info',
  getOperateLogs: '/b/company/operate_logs',
  getLoginLogs: '/b/company/login_logs',
  getRoleList: '/b/company/role',
  getRolePermission: '/b/company/role_get_permission',
}

export default urls

export type Urls = typeof urls

export type UrlKeys = keyof Urls
