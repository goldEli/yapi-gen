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
    { key: '/Situation', normal: 'system-nor', active: 'system-sel' },
    {
      key: '/ProjectManagement',
      normal: 'folder-open-nor',
      active: 'folder-open-sel',
    },
    { key: '/SiteNotifications', normal: 'bell', active: 'bell-sel' },
    { key: '/CalendarManager', normal: 'database', active: 'calendar-sel' },
    { key: '/Report', normal: 'log-nor', active: 'log-sel' },
    { key: '/AdminManagement', normal: 'management', active: '' },
    { key: '/Performance', normal: 'measure-nor', active: 'measure-sel' },
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

      state.menuPermission = action.payload.menuPermission
      state.userPreferenceConfig = action.payload.userPreferenceConfig
    })
  },
})

export const { setIsRefresh, setUserPreferenceConfig, setCurrentMenu } =
  counterSlice.actions

export default counterSlice.reducer
