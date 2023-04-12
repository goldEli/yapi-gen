import { createSlice } from '@reduxjs/toolkit'
import { getTemplateList } from './thunk'

type SliceState = {
  // 编辑的状态
  editSave: boolean
  activeItem: any
  dataList: any
  option: any
  // 装模板的参数
  templateContentConfigs: any
  // 装表单的参数 填写要求的表单内容
  fillingRequirements: any
  // 装汇报内容的参数
  reportContent: any
  // 开始时间和结束时间有误
  err: boolean
}

const formWork = createSlice({
  name: 'formWork',
  initialState: {
    editSave: false,
    activeItem: null,
    err: true,
    option: [
      {
        type: 1,
        icon: 'user-more',
      },
      {
        type: 2,
        icon: 'attachment',
      },
      {
        type: 3,
        icon: 'text',
      },
      {
        type: 4,
        icon: 'horizontal',
      },
    ],
    dataList: [
      {
        name: 123,
        id: 1,
      },
    ],
    fillingRequirements: {},
    reportContent: {},
    templateContentConfigs: [],
  } as SliceState,
  reducers: {
    // 是否保存
    setEditSave: (state: any, action) => {
      state.editSave = action.payload
    },
    // 当前选中的
    setActiveItem: (state: any, action) => {
      state.activeItem = action.payload
    },
    // 装表单的参数 填写要求的表单内容
    setFillingRequirements: (state: any, action: any) => {
      state.fillingRequirements = action.payload
    },
    // 装汇报内容的参数
    setReportContent: (state: any, action) => {
      state.reportContent = action.payload
    },
    // 装模板的参数
    setTemplateContentConfigs: (state: any, action) => {
      state.templateContentConfigs = action.payload
    },
    // 判断开始时间和结束时间
    setErr: (state: any, action) => {
      state.err = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getTemplateList.fulfilled, (state, action) => {
      const data = action.payload.list
      state.dataList = data
    })
  },
})

export const {
  setEditSave,
  setActiveItem,
  setFillingRequirements,
  setReportContent,
  setTemplateContentConfigs,
  setErr,
} = formWork.actions
export default formWork.reducer
