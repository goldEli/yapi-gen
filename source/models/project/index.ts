/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable no-undefined */
import { useState } from 'react'
import * as services from '@/services'
import { useTranslation } from 'react-i18next'

export default () => {
  const [t] = useTranslation()
  const [selectTreeData, setSelectTreeData] = useState<any>([])
  const [selectAllStaffData, setSelectAllStaffData] = useState<any>([])
  const [projectList, setProjectList] = useState<any>({
    list: undefined,
  })
  const [tagList, setTagList] = useState<any>([])
  const [priorityList, setPriorityList] = useState<any>([])
  const [coverList, setCoverList] = useState<any>([])
  const [projectPermission, setProjectPermission] = useState<any>([])
  const [projectInfo, setProjectInfo] = useState<any>({})
  const [memberList, setMemberList] = useState<any>([])
  const [isRefreshMember, setIsRefreshMember] = useState(false)
  const [filterAll, setFilterAll] = useState<any>([])
  const [isRefreshIterateList, setIsRefreshIterateList] = useState<any>(false)
  const [fieldList, setFieldList] = useState<any>({
    list: undefined,
  })
  const [categoryList, setCategoryList] = useState<any>([])
  const [categoryEditList, setCategoryEditList] = useState<any>([])
  const [statusWorkList, setStatusWorkList] = useState<any>([])
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })
  // 改变项目-项目id
  const [isChangeProject, setIsChangeProject] = useState(0)
  // 筛选需求列表参数，用于回填创建需求弹窗
  const [filterParamsModal, setFilterParamsModal] = useState<any>({})
  const [selectGroupList, setSelectGroupList] = useState<any>([])
  // 是否更新分组列表，用于获取count
  const [isRefreshGroup, setIsRefreshGroup] = useState<any>(false)

  const colorList = [
    { key: '#2877FF', bgColor: '#F2F7FF' },
    { key: '#FF5C5E', bgColor: '#FCEEEE' },
    { key: '#43BA9A', bgColor: '#EDF7F4' },
    { key: '#FA9746', bgColor: '#FCF3EB' },
    { key: '#969799', bgColor: '#F2F2F4' },
    { key: '#8046FA', bgColor: '#F0EBFC' },
    { key: '#FA46E1', bgColor: '#FCEBFA' },
    { key: '#FF8B8B', bgColor: '#FCEBEB' },
    { key: '#269758', bgColor: '#EBFCF3' },
    { key: '#3AA7FF', bgColor: '#EBF4FC' },
    { key: '#00ADD2', bgColor: '#EBF9FC' },
    { key: '#ED7303', bgColor: '#FCF3EB' },
    { key: '#4D5EFF', bgColor: '#EBEDFC' },
    { key: '#464646', bgColor: '#EDEDED' },
  ]
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

  const getWorkflowList = async (params: any) => {
    const result = await services.project.getWorkflowList(params)
    setWorkList(result)
    return result
  }

  const getStatusList = async (params: any) => {
    const result = await services.project.storyConfigStatusList(params)
    setStatusWorkList(result)
  }

  const getCategoryEditList = async (params: any) => {
    const result = await services.project.storyConfigCategoryList(params)
    setCategoryEditList(result)
    return result
  }

  const getCategoryList = async (params: any) => {
    const result = await services.project.storyConfigCategoryList(params)
    setCategoryList(result)
    return result
  }

  const getFieldList = async (params: any) => {
    const result = await services.project.storyConfigField(params)
    setFieldList(result)
    return result
  }

  const getFieldListCustom = async (params: any) => {
    const result = await services.project.storyConfigField(params)
    return result
  }

  const getProjectList = async (params: any) => {
    const result = await services.project.getProjectList(params)
    setProjectList(result)
  }

  const getTagList = async (params: any) => {
    const result = await services.project.getTagList(params)
    setTagList(result)
    return result
  }

  const getPriorityList = async (params: any) => {
    const result = await services.mine.getPriOrStu(params)
    setPriorityList(result)
  }

  const getProjectCoverList = async () => {
    const result = await services.project.getProjectCoverList()
    setCoverList(result)
  }

  const getProjectInfo = async (params: any) => {
    const result = await services.project.getProjectInfo(params)
    setProjectInfo(result)
    return result
  }

  const getMemberList = async (params: any) => {
    const result = await services.project.getProjectMember(params)
    setMemberList(result)
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
    projectList,
    getProjectList,
    tagList,
    getTagList,
    coverList,
    getProjectCoverList,
    projectInfo,
    getProjectInfo,
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
    setProjectPermission,
    projectPermission,
    getMemberList,
    memberList,
    setIsRefreshMember,
    isRefreshMember,
    setFilterAll,
    filterAll,
    setIsRefreshIterateList,
    isRefreshIterateList,
    setProjectInfo,
    setTagList,
    colorList,
    getFieldList,
    getFieldListCustom,
    fieldList,
    setFieldList,
    option,
    addStoryConfigField,
    deleteStoryConfigField,
    updateStoryConfigField,
    getCategoryList,
    categoryList,
    addStoryConfigCategory,
    updateStoryConfigCategory,
    deleteStoryConfigCategory,
    changeCategoryStatus,
    changeStoryConfigCategory,
    getStatusList,
    statusWorkList,
    getWorkflowList,
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
    workList,
    setWorkList,
    setSelectTreeData,
    selectTreeData,
    setSelectAllStaffData,
    selectAllStaffData,
    setIsChangeProject,
    isChangeProject,
    getGroupList,
    addProjectGroup,
    updateProjectGroup,
    deleteProjectGroup,
    getPriorityList,
    priorityList,
    setFilterParamsModal,
    filterParamsModal,
    setSelectGroupList,
    selectGroupList,
    categoryEditList,
    getCategoryEditList,
    setIsRefreshGroup,
    isRefreshGroup,
  }
}
