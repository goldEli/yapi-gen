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
import member from './member'
import mine from './mine'
import project from './project'
import demand from './demand'
import iterate from './iterate'
import global from './global'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    water: waterReducer,
    user,
    companyInfo,
    member,
    mine,
    project,
    demand,
    iterate,
    global,
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
