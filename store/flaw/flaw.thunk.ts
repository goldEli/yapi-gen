import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch } from '@store/index'
import { setFlawDetailDrawer } from '.'
import { setListActiveId } from '@store/global'

const name = 'flaw'

// 缺陷列表
export const getFlawList = createAsyncThunk(
  `${name}/getFlawList`,
  async (params: API.Flaw.GetFlawList.Params) => {
    const res = await services.flaw.getFlawList(params)
    return res
  },
)

export const saveFlawDetailDrawer =
  (params: any) => async (dispatch: AppDispatch) => {
    dispatch(setFlawDetailDrawer(params))
    dispatch(setListActiveId(params.params?.id ?? 0))
  }

// 缺陷详情
export const getFlawInfo = createAsyncThunk(
  `${name}/getFlawInfo`,
  async (params: API.Flaw.GetFlawInfo.Params) => {
    const res = await services.flaw.getFlawInfo(params)
    return res
  },
)

// 缺陷评论列表
export const getFlawCommentList = createAsyncThunk(
  `${name}/getFlawCommentList`,
  async (params: API.Flaw.GetFlawCommentList.Params) => {
    const res = await services.flaw.getFlawCommentList(params)
    return res
  },
)
