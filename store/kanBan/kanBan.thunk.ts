import { kanbanConfig } from './data'
import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch, store } from '@store/index'
import { setSaveAsViewModelInfo, setShareModelInfo } from '.'
import { getMessage } from '@/components/Message'

const name = 'kanBan'

// 看板配置列表
export const getKanbanConfigList = createAsyncThunk(
  `${name}/getKanbanConfigList`,
  async (param: API.KanbanConfig.GetKanbanConfigList.Params) => {
    const res = await services.kanbanConfig.getKanbanConfigList(param)
    console.log(res)
  },
)

// 属性看板
export const onRefreshKanBan = () => async (dispatch: AppDispatch) => {}

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

// 打开分享弹窗
export const openShareModel = () => async (dispatch: AppDispatch) => {
  dispatch(setShareModelInfo({ visible: true }))
}

// 关闭分享弹窗
export const closeShareModel = () => async (dispatch: AppDispatch) => {
  dispatch(setShareModelInfo({ visible: false }))
}

// 分享
export const onShareModel = () => async (dispatch: AppDispatch) => {
  // TODO

  getMessage({ msg: '保存成功!', type: 'success' })
  dispatch(closeSaveAsViewModel())
}
