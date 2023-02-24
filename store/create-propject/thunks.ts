import { addProject } from '@/services/project'
import { createAsyncThunk } from '@reduxjs/toolkit'

// 登录，获取会话令牌
export const postCreate = createAsyncThunk(
  'create/postCreate',
  async (value: any) => {
    await addProject(value)
  },
)
