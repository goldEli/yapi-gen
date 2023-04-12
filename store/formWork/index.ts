/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { createSlice } from '@reduxjs/toolkit'
import { getTemplateList, templateDetail } from './thunk'

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
  // 模板名称
  templateName: string
  // 详情数据
  templateDetailValues: any
}

const formWork = createSlice({
  name: 'formWork',
  initialState: {
    editSave: false,
    activeItem: null,
    err: true,
    templateName: '',
    templateDetailValues: null,
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
    dataList: [],
    fillingRequirements: {},
    reportContent: null,
    templateContentConfigs: [
      {
        name: '汇报对象',
        is_required: 2,
        tips: '',
        type: 1,
      },
    ],
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
    // 模板名称
    setTemplateName: (state: any, action) => {
      state.templateName = action.payload
    },
    setDataList: (state: any, action) => {
      state.dataList = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getTemplateList.fulfilled, (state, action) => {
      const data = action.payload
      state.dataList = data
    })
    builder.addCase(templateDetail.fulfilled, (state, action) => {
      const data = action.payload.data
      state.templateDetailValues = data
      state.templateContentConfigs = data.template_content_configs
      state.reportContent = {
        template_configs: data.template_configs.map((el: any) => ({
          ...el,
          target_value:
            el.target_type === 4 ? { name: el.target_value } : el.target_value,
        })),
        is_all_view: data.is_all_view,
        is_all_write: data.is_all_write,
      }
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
  setTemplateName,
  setDataList,
} = formWork.actions
export default formWork.reducer
