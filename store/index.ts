import { configureStore, type ThunkAction, type Action } from '@reduxjs/toolkit'
import {
  type TypedUseSelectorHook,
  useDispatch as useOriginDispatch,
  useSelector as useOriginSelector,
} from 'react-redux'
import counterReducer from './counterSlice'
import waterReducer from './waterState'
import companyInfo from './companyInfo'
import user from './user'
import memberInfo from './memberInfo'
import mine from './mine'
import project from './project'
import demand from './demand'
import iterate from './iterate'
import global from './global'
import cover from './cover/index'
import view from './view/index'
import createProject from './create-propject/index'
import teams from './teams'
import colorText from './color-text'
import category from './category'
import log from './log'
import calendar from './calendar'
import schedule from './schedule'
import scroll from './scroll'
import calendarPanel from './calendarPanle'
import siteNotifications from './SiteNotifications'
import formWork from './formWork'
import createScheduleVisualization from './createScheduleVisualization'
import workReport from './workReport'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    water: waterReducer,
    user,
    companyInfo,
    memberInfo,
    mine,
    project,
    demand,
    iterate,
    global,
    cover,
    view,
    createProject,
    teams,
    category,
    colorText,
    log,
    calendar,
    schedule,
    scroll,
    calendarPanel,
    siteNotifications,
    formWork,
    createScheduleVisualization,
    workReport,
  },
})

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export const useDispatch: () => AppDispatch = useOriginDispatch

export const useSelector: TypedUseSelectorHook<RootState> = useOriginSelector
