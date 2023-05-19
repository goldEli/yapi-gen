import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch } from '@store/index'
import { setSprintDetailDrawer } from '.'
import { setListActiveId } from '@store/global'

const name = 'sprint'

// 任务列表列表
export const getSprintList = createAsyncThunk(
  `${name}/getSprintList`,
  async () => {
    const res = await services.sprint.getSprintList({ id: 123 })

    return res.data.list
  },
)

export const saveSprintDetailDrawer =
  (params: any) => async (dispatch: AppDispatch) => {
    dispatch(setSprintDetailDrawer(params))
    dispatch(setListActiveId(params?.id ?? 0))
  }
