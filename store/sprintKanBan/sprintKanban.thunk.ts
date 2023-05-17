import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch } from '@store/index'
import { setSaveAsViewModelInfo } from '.'

const name = 'sprintKanBan'

export const openSaveAsViewModel = () => async (dispatch: AppDispatch) => {
  dispatch(setSaveAsViewModelInfo({ visible: true }))
}

export const closeSaveAsViewModel = () => async (dispatch: AppDispatch) => {
  dispatch(setSaveAsViewModelInfo({ visible: false }))
}

// 保存视图
export const onSaveAsViewModel = () => async (dispatch: AppDispatch) => {
  // TODO
  dispatch(closeSaveAsViewModel())
}
