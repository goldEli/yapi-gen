import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch, store } from '@store/index'
import { setSaveAsViewModelInfo } from '.'
import { getMessage } from '@/components/Message'

const name = 'sprintKanBan'

export const openSaveAsViewModel =
  (key?: Model.SprintKanBan.ViewItem['key']) =>
  async (dispatch: AppDispatch) => {
    const { sortByView } = store.getState()?.sprintKanBan
    const viewItem = sortByView?.find(item => item.key === key)
    dispatch(setSaveAsViewModelInfo({ visible: true, viewItem }))
  }

export const closeSaveAsViewModel = () => async (dispatch: AppDispatch) => {
  dispatch(setSaveAsViewModelInfo({ visible: false }))
}

// 保存视图
export const onSaveAsViewModel =
  (data: Partial<Model.SprintKanBan.ViewItem>) =>
  async (dispatch: AppDispatch) => {
    // TODO
    console.log('onSaveAsViewModel', data)
    getMessage({ msg: '保存成功!', type: 'success' })
    dispatch(closeSaveAsViewModel())
  }

export const openShareModel = () => async (dispatch: AppDispatch) => {
  dispatch(setSaveAsViewModelInfo({ visible: true }))
}

export const closeShareModel = () => async (dispatch: AppDispatch) => {
  dispatch(setSaveAsViewModelInfo({ visible: false }))
}

// 保存视图
export const onShareModel = () => async (dispatch: AppDispatch) => {
  // TODO

  getMessage({ msg: '保存成功!', type: 'success' })
  dispatch(closeSaveAsViewModel())
}
