import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch } from '@store/index'
import { setDemandDetailDrawerProps } from '.'
import { setListActiveId } from '@store/global'
import { setIsUpdateAddWorkItem } from '@store/project'

export const saveDemandDetailDrawer =
  (params: any) => async (dispatch: AppDispatch) => {
    dispatch(setDemandDetailDrawerProps(params))
    dispatch(setListActiveId(params?.id ?? 0))
  }

// 需求详情
export const getDemandInfo = createAsyncThunk(
  `${name}/getDemandInfo`,
  async (params: any) => {
    const res = await services.demand.getDemandInfo(params)
    setIsUpdateAddWorkItem(0)
    return res
  },
)

// 需求评论列表
export const getDemandCommentList = createAsyncThunk(
  `${name}/getDemandCommentList`,
  async (params: any) => {
    const res = await services.demand.getCommentList(params)
    return res
  },
)
