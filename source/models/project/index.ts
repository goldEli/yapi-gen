/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable no-undefined */
import { useState } from 'react'
import * as services from '@/services'
import { useTranslation } from 'react-i18next'

export default () => {
  const [t] = useTranslation()
  // 改变项目-项目id
  const [isChangeProject, setIsChangeProject] = useState(0)
  // 筛选需求列表参数，用于回填创建需求弹窗
  const [filterParamsModal, setFilterParamsModal] = useState<any>({})
  const [selectGroupList, setSelectGroupList] = useState<any>([])
  // 是否更新分组列表，用于获取count
  const [isRefreshGroup, setIsRefreshGroup] = useState<any>(false)
  // 需求列表筛选项值计数
  const [filterKeys, setFilterKeys] = useState<any>([])
  // 关于项目的下拉数据
  const [projectInfoValues, setProjectInfoValues] = useState<any>([])

  const option = [
    { label: t('newlyAdd.lineText'), value: '1', type: 'text' },
    { label: t('newlyAdd.moreLineText'), value: '2', type: 'textarea' },
    { label: t('newlyAdd.radioDropdown'), value: '3', type: 'select' },
    { label: t('newlyAdd.multiDropdown'), value: '4', type: 'select_checkbox' },
    { label: t('newlyAdd.checkbox'), value: '5', type: 'checkbox' },
    { label: t('newlyAdd.radio'), value: '6', type: 'radio' },
    { label: t('newlyAdd.time'), value: '7', type: 'date' },
    { label: t('newlyAdd.number'), value: '8', type: 'number' },
    { label: t('version2.personRadio'), value: '9', type: 'user_select' },
    {
      label: t('version2.personCheckbox'),
      value: '10',
      type: 'user_select_checkbox',
    },
  ]

  // 获取项目的下拉数据
  const getProjectInfoValues = async (params: any) => {
    const result = await services.project.getProjectInfoValues(params)
    setProjectInfoValues(result)
    return result
  }

  const {
    addProject,
    updateProject,
    deleteProject,
    openProject,
    stopProject,
    updateMember,
    deleteMember,
    addMember,
    getProjectPermission,
    addPermission,
    deletePermission,
    updatePermission,
    getPermission,
    setPermission,
    getProjectMember,
    addStoryConfigField,
    deleteStoryConfigField,
    updateStoryConfigField,
    addStoryConfigCategory,
    updateStoryConfigCategory,
    deleteStoryConfigCategory,
    changeCategoryStatus,
    changeStoryConfigCategory,
    addStoryConfigWorkflow,
    updateStoryConfigWorkflow,
    deleteStoryConfigWorkflow,
    sortchangeWorkflow,
    saveWorkflowStatus,
    getWorkflowInfo,
    saveWorkflowConfig,
    addStoryConfigStatus,
    deleteStoryConfigStatus,
    updateStoryConfigStatus,
    getGroupList,
    addProjectGroup,
    updateProjectGroup,
    deleteProjectGroup,
  } = services.project

  return {
    addProject,
    updateProject,
    deleteProject,
    openProject,
    stopProject,
    updateMember,
    deleteMember,
    addMember,
    getProjectPermission,
    addPermission,
    deletePermission,
    updatePermission,
    getPermission,
    setPermission,
    getProjectMember,
    option,
    addStoryConfigField,
    deleteStoryConfigField,
    updateStoryConfigField,
    addStoryConfigCategory,
    updateStoryConfigCategory,
    deleteStoryConfigCategory,
    changeCategoryStatus,
    changeStoryConfigCategory,
    addStoryConfigWorkflow,
    updateStoryConfigWorkflow,
    deleteStoryConfigWorkflow,
    sortchangeWorkflow,
    saveWorkflowStatus,
    getWorkflowInfo,
    saveWorkflowConfig,
    addStoryConfigStatus,
    deleteStoryConfigStatus,
    updateStoryConfigStatus,
    setIsChangeProject,
    isChangeProject,
    getGroupList,
    addProjectGroup,
    updateProjectGroup,
    deleteProjectGroup,
    setFilterParamsModal,
    filterParamsModal,
    setSelectGroupList,
    selectGroupList,
    setIsRefreshGroup,
    isRefreshGroup,
    setFilterKeys,
    filterKeys,
    getProjectInfoValues,
    projectInfoValues,
    setProjectInfoValues,
  }
}
