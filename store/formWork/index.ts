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
  reportContentCopy: any
  reportContent: any
  // 开始时间和结束时间有误
  err: boolean
  // 详情数据
  templateDetailValues: any
  // 报错的提示语
  errMsg: string
  templateName: string
}

const formWork = createSlice({
  name: 'formWork',
  initialState: {
    editSave: true,
    activeItem: null,
    err: true,
    errMsg: '',
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
    reportContentCopy: null,
    templateName: '',
    templateContentConfigs: [
      {
        name: '汇报对象',
        is_required: 1,
        tips: '',
        type: 1,
      },
    ],
  } as SliceState,
  reducers: {
    // 当前选中的
    setActiveItem: (state: any, action) => {
      state.activeItem = action.payload
    },
    // 装表单的参数 填写要求的表单内容
    setFillingRequirements: (state: any, action: any) => {
      state.fillingRequirements = action.payload
    },
    // 装汇报内容的参数
    setReportContentCopy: (state: any, action) => {
      state.reportContentCopy = action.payload
    },
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

    setDataList: (state: any, action) => {
      state.dataList = action.payload
    },
    setEditSave: (state: any, action) => {
      state.editSave = action.payload
    },
    setErrMsg: (state: any, action) => {
      state.errMsg = action.payload
    },
    setTemplateName: (state: any, action) => {
      state.templateName = action.payload
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
      if (data?.template_content_configs?.length) {
        state.templateContentConfigs = data.template_content_configs
      }
      state.reportContent = {
        template_configs: data?.template_configs?.map((el: any) => ({
          ...el,
          target_value:
            el.target_type === 4 ? { name: el.target_value } : el.target_value,
        })),
        is_all_view: data.is_all_view,
        is_all_write: data.is_all_write,
      }
      const nowData = [
        {
          label: 'monday',
          key: 0,
          value: true,
        },
        {
          label: 'tuesday',
          key: 1,
          value: true,
        },
        {
          label: 'wednesday',
          key: 2,
          value: true,
        },
        {
          label: 'thursday',
          key: 3,
          value: true,
        },
        {
          label: 'friday',
          key: 4,
          value: true,
        },
        {
          label: 'saturday',
          key: 5,
          value: true,
        },
        {
          label: 'sunday',
          key: 6,
          value: true,
        },
      ]
      let dayData = []
      if (data.submit_cycle == 1) {
        const newData = data.requirement.day
        dayData = nowData.map((item: any) => ({
          ...item,
          value: newData?.includes(item.key) ? true : false,
        }))
      }
      state.fillingRequirements = {
        // 填写周期 1-每天 2-每周 3-每月 4-不重复
        submit_cycle: data.submit_cycle,
        // 填写周期每天属性：是否跟随中国法定节假日自动调整，1：是，2：否
        is_holiday: data.requirement.is_holiday === 1 ? true : false,
        // 填写周期每天属性：0：周一，1：周二以此类推
        day: dayData,
        // 截止时间
        end_time: data.requirement.end_time,
        // 开始时间
        start_time: data.requirement.start_time,
        // 是否自动提醒 1- 是 2-否
        auto_reminder: data.auto_reminder === 1 ? true : false,
        // 提醒时间（单位秒）
        reminder_time: data.reminder_time,
        //截止时间后允许补交1- 是 2-否
        is_supply: data.is_supply === 1 ? true : false,
        // 每个周期限填一次1- 是 2-否
        is_cycle_limit: data.is_cycle_limit === 1 ? true : false,
        // 提交汇报提交人可修改 1-是 2-否
        is_submitter_edit: data.is_submitter_edit === 1 ? true : false,
        // 补交范围，数字对应周期属性
        hand_scope: Number(data.hand_scope),
      }
    })
  },
})

export const {
  setActiveItem,
  setFillingRequirements,
  setReportContent,
  setTemplateContentConfigs,
  setErr,
  setDataList,
  setEditSave,
  setErrMsg,
  setTemplateName,
  setReportContentCopy,
} = formWork.actions
export default formWork.reducer
