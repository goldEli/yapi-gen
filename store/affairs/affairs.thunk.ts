import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch } from '@store/index'
import { setAffairsDetailDrawer } from '.'
import { setListActiveId } from '@store/global'

const name = 'affairs'

// 事务列表
export const getAffairsList = createAsyncThunk(
  `${name}/getAffairsList`,
  async (params: API.Affairs.GetAffairsList.Params) => {
    const res = await services.affairs.getAffairsList(params)
    return res
  },
)

export const saveAffairsDetailDrawer =
  (params: any) => async (dispatch: AppDispatch) => {
    dispatch(setAffairsDetailDrawer(params))
    dispatch(setListActiveId(params.params?.id ?? 0))
  }

// 事务详情
export const getAffairsInfo = createAsyncThunk(
  `${name}/getAffairsInfo`,
  async (params: API.Affairs.GetAffairsInfo.Params) => {
    const res = await services.affairs.getAffairsInfo(params)
    return res
  },
)

// 事务评论列表
export const getAffairsCommentList = createAsyncThunk(
  `${name}/getAffairsCommentList`,
  async (params: API.Affairs.GetAffairsCommentList.Params) => {
    const res = await services.affairs.getAffairsCommentList(params)
    return res
  },
)
