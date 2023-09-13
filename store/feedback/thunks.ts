import { getProjectCoverList } from '@/services/project'
import { createAsyncThunk } from '@reduxjs/toolkit'

// 登录，获取会话令牌
export const getProjectCover = createAsyncThunk(
  'cover/getTokenByTicket',
  async () => {
    const data: any = await getProjectCoverList()
    return data
  },
)
