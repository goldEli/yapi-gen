import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

// 类别排序
export const storyConfigCategoryList: any = createAsyncThunk(
  'storyConfigCategoryList',
  (parmas: any) => services.project.storyConfigCategoryList(parmas),
)
