import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'
import { AppDispatch } from '@store/index'

const name = 'sprint'

// 任务列表列表
export const getSprintList = createAsyncThunk(
  `${name}/getSprintList`,
  async () => {
    const res = await services.sprint.getSprintList({ id: 123 })

    return res.data.list
  },
)
