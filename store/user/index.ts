/* eslint-disable no-duplicate-imports */
import { createSlice } from '@reduxjs/toolkit'
import { getLoginDetail } from './user.thunk'

export interface CounterState {
  loginInfo: any
  userInfo: any
  menuPermission: any
  userPreferenceConfig: any
  isRefresh: boolean
  currentMenu: any
  menuIconList: any
  companyList: any
}

const initialState: CounterState = {
  companyList: [],
  loginInfo: {},
  userInfo: {},
  menuPermission: {},
  userPreferenceConfig: {},
  isRefresh: false,
  currentMenu: {},
  menuIconList: [
    {
      key: '/Project',
      normal: 'folder-open-nor',
      active: 'folder-open-sel',
    },
    { key: '/Report', normal: 'log-nor', active: 'log-sel' },
    { key: '/CalendarManager', normal: 'database', active: 'calendar-sel' },
    { key: '/EmployeeProfile', normal: 'employee-nor', active: 'employee-sel' },
    { key: '/Statistics', normal: 'measure-nor', active: 'measure-sel' },
    { key: '/Trends', normal: 'bell', active: 'bell-sel' },
    { key: '/Mine', normal: 'user', active: 'user' },
    { key: '/AdminManagement', normal: 'management', active: 'management' },
  ],
}

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCompanyList: (state, action) => {
      state.companyList = action.payload
    },
    setIsRefresh: (state, action) => {
      state.isRefresh = action.payload
    },
    setCurrentMenu(preState: CounterState, action) {
      preState.currentMenu = action.payload
    },
    setUserPreferenceConfig(preState: CounterState, action) {
      preState.userPreferenceConfig = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getLoginDetail.fulfilled, (state, action) => {
      state.loginInfo = action.payload.loginInfo
      state.userInfo = action.payload.userInfo

      // state.menuPermission = action.payload.menuPermission
      state.menuPermission = {
        menus: [
          {
            id: 603,
            name: '项目',
            url: '/Project',
            permission: 'b/project',
            p_menu: '',
            status: 1,
            created_at: '-0001-11-30 00:00:00',
            updated_at: '2023-08-07 23:56:41',
          },

          {
            id: 616,
            name: '汇报',
            url: '/Report',
            permission: 'b/work_report',
            p_menu: '',
            status: 1,
            created_at: '-0001-11-30 00:00:00',
            updated_at: '2023-08-07 23:56:41',
            children: [
              {
                id: 617,
                name: '汇报',
                url: '/Report/Review',
                permission: 'b/work_report/list',
                p_menu: '\u5de5\u4f5c\u6c47\u62a5',
                status: 1,
                created_at: '-0001-11-30 00:00:00',
                updated_at: '2023-08-07 23:56:41',
              },
              {
                id: 618,
                name: '统计',
                url: '/Report/Statistics',
                permission: 'b/work_report/statistics',
                p_menu: '\u5de5\u4f5c\u6c47\u62a5',
                status: 1,
                created_at: '-0001-11-30 00:00:00',
                updated_at: '2023-08-07 23:56:41',
              },
              {
                id: 619,
                name: '模板',
                url: '/Report/Formwork',
                permission: 'b/work_report/template',
                p_menu: '\u5de5\u4f5c\u6c47\u62a5',
                status: 1,
                created_at: '-0001-11-30 00:00:00',
                updated_at: '2023-08-07 23:56:41',
              },
            ],
          },
          {
            id: 614,
            name: '日程',
            url: '/CalendarManager',
            permission: 'b/calendar',
            p_menu: '',
            status: 1,
            created_at: '-0001-11-30 00:00:00',
            updated_at: '2023-08-07 23:56:41',
            children: [],
          },
          {
            id: 642,
            name: '人员',
            url: '/EmployeeProfile',
            permission: 'b/member_overview',
            p_menu: '',
            status: 1,
            created_at: '2023-09-04 10:25:46',
            updated_at: '2023-09-04 11:15:06',
            children: [],
          },
          {
            id: 602,
            name: '统计',
            url: '/Statistics',
            permission: '',
            p_menu: '',
            status: 1,
            created_at: '-0001-11-30 00:00:00',
            updated_at: '2023-08-07 23:56:41',
            children: [
              {
                id: 604,
                name: '任务',
                url: '',
                permission: 'b/project',
                p_menu: '\u9879\u76ee\u7ba1\u7406',
                status: 1,
                created_at: '-0001-11-30 00:00:00',
                updated_at: '2023-08-07 23:56:41',
              },
              {
                id: 605,
                name: '公司',
                url: '',
                permission: '',
                p_menu: '\u9879\u76ee\u7ba1\u7406',
                status: 1,
                created_at: '-0001-11-30 00:00:00',
                updated_at: '2023-08-07 23:56:41',
              },
            ],
          },
          {
            id: 606,
            name: '后台',
            url: '/AdminManagement',
            permission: '',
            p_menu: '',
            status: 1,
            created_at: '-0001-11-30 00:00:00',
            updated_at: '2023-08-07 23:56:41',
            children: [
              {
                id: 607,
                name: '公司信息',
                url: '/AdminManagement/CompanyInfo',
                permission: 'b/company/info',
                p_menu: '\u540e\u53f0\u7ba1\u7406',
                status: 1,
                created_at: '-0001-11-30 00:00:00',
                updated_at: '2023-08-07 23:56:41',
              },
              {
                id: 608,
                name: '员工管理',
                url: '/AdminManagement/StaffManagement',
                permission: 'b/companyuser/list',
                p_menu: '\u540e\u53f0\u7ba1\u7406',
                status: 1,
                created_at: '-0001-11-30 00:00:00',
                updated_at: '2023-08-07 23:56:41',
              },
              {
                id: 609,
                name: '团队管理',
                url: '/AdminManagement/TeamManagement',
                permission: 'b/company/teams',
                p_menu: '\u540e\u53f0\u7ba1\u7406',
                status: 1,
                created_at: '-0001-11-30 00:00:00',
                updated_at: '2023-08-07 23:56:41',
              },
              {
                id: 610,
                name: '权限管理',
                url: '/AdminManagement/PermissionManagement',
                permission: 'b/company/role',
                p_menu: '\u540e\u53f0\u7ba1\u7406',
                status: 1,
                created_at: '-0001-11-30 00:00:00',
                updated_at: '2023-08-07 23:56:41',
              },
              {
                id: 611,
                name: '水印管理',
                url: '/AdminManagement/WaterMarkManagement',
                permission: 'b/company/config',
                p_menu: '\u540e\u53f0\u7ba1\u7406',
                status: 1,
                created_at: '-0001-11-30 00:00:00',
                updated_at: '2023-08-07 23:56:41',
              },
              {
                id: 612,
                name: '操作管理',
                url: '/AdminManagement/OperationManagement',
                permission: 'b/company/operate_logs',
                p_menu: '\u540e\u53f0\u7ba1\u7406',
                status: 1,
                created_at: '-0001-11-30 00:00:00',
                updated_at: '2023-08-07 23:56:41',
              },
              {
                id: 613,
                name: '登录管理',
                url: '/AdminManagement/LoginManagement',
                permission: 'b/company/login_logs',
                p_menu: '\u540e\u53f0\u7ba1\u7406',
                status: 1,
                created_at: '-0001-11-30 00:00:00',
                updated_at: '2023-08-07 23:56:41',
              },
              {
                id: 621,
                name: '系统公告',
                url: '/AdminManagement/NoteManagement',
                permission: 'b/sys_notice',
                p_menu: '\u540e\u53f0\u7ba1\u7406',
                status: 1,
                created_at: '-0001-11-30 00:00:00',
                updated_at: '2023-08-07 23:56:41',
              },
            ],
          },
        ],
        priority_url: '/Project',
        help_document_path: '',
      }
      state.userPreferenceConfig = action.payload.userPreferenceConfig
    })
  },
})

export const { setIsRefresh, setUserPreferenceConfig, setCurrentMenu } =
  counterSlice.actions

export default counterSlice.reducer
