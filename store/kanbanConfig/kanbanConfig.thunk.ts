import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch, store } from '@store/index'
import { modifyColumn, setEditColumnModelInfo, setSaveAsViewModelInfo } from '.'
import { getMessage } from '@/components/Message'

const name = 'KanbanConfig'

// 属性看板
export const onRefreshKanBan = () => async (dispatch: AppDispatch) => {}

export const openSaveAsViewModel =
  (id?: Model.KanbanConfig.ConfigListItem['id']) =>
  async (dispatch: AppDispatch) => {
    const { viewList } = store.getState()?.KanbanConfig
    const viewItem = viewList?.find(item => item.id === id)
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

export const openEditColumnModel =
  (data: Model.KanbanConfig.Column) => async (dispatch: AppDispatch) => {
    dispatch(
      setEditColumnModelInfo({
        visible: true,
        columnInfo: data,
      }),
    )
  }

export const closeEditColumnModel = () => async (dispatch: AppDispatch) => {
  dispatch(
    setEditColumnModelInfo({
      visible: false,
    }),
  )
}

export const onOkEditColumnModel =
  (data: Model.KanbanConfig.Column) => async (dispatch: AppDispatch) => {
    dispatch(modifyColumn(data))
    dispatch(
      setEditColumnModelInfo({
        visible: false,
      }),
    )
  }