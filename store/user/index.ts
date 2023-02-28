/* eslint-disable no-duplicate-imports */
import { createSlice } from '@reduxjs/toolkit'
import { getLoginDetail } from './user.thunk'

export interface CounterState {
  loginInfo: any
  userInfo: any
  menuPermission: any
  isRefresh: boolean
  currentMenu: any
  menuIconList: any
}

const initialState: CounterState = {
  loginInfo: {},
  userInfo: {},
  menuPermission: {},
  isRefresh: false,
  currentMenu: {},
  menuIconList: [
    { key: '/Situation', normal: 'system-nor', active: 'system-sel' },
    {
      key: '/ProjectManagement',
      normal: 'folder-open-nor',
      active: 'folder-open-sel',
    },
    { key: '/LogManagement', normal: 'log-nor', active: 'log-sel' },
    { key: '/AdminManagement', normal: 'management', active: '' },
  ],
}

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsRefresh: (state, action) => {
      state.isRefresh = action.payload
    },
    setCurrentMenu(preState: CounterState, action) {
      preState.currentMenu = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getLoginDetail.fulfilled, (state, action) => {
      state.loginInfo = action.payload.loginInfo
      state.userInfo = action.payload.userInfo
      state.menuPermission = action.payload.menuPermission
      state.currentMenu = action.payload.menuPermission?.menus?.filter(
        (i: any) => i.url === action.payload.menuPermission.priorityUrl,
      )[0]
    })
  },
})

export const { setIsRefresh } = counterSlice.actions

export default counterSlice.reducer
