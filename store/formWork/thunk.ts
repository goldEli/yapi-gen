import { createAsyncThunk } from '@reduxjs/toolkit'
import * as services from '@/services'

// 模板列表
export const getTemplateList: any = createAsyncThunk(
  'templateList',
  (parmas: any) => services.formwork.templateList(parmas),
)