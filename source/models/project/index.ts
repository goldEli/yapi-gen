/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable no-undefined */
import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [projectList, setProjectList] = useState<any>({
    list: undefined,
  })
  const [tagList, setTagList] = useState<any>([])
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
  const [statusWorkList, setStatusWorkList] = useState<any>([])
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })

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
    { label: '单行文本', value: '1', type: 'text' },
    { label: '多行文本', value: '2', type: 'textarea' },
    { label: '单选下拉列表', value: '3', type: 'select' },
    { label: '多选下拉列表', value: '4', type: 'select_checkbox' },
    { label: '复选框', value: '5', type: 'checkbox' },
    { label: '单选框', value: '6', type: 'radio' },
    { label: '日期', value: '7', type: 'date' },
    { label: '数值型', value: '8', type: 'number' },
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

  const getCategoryList = async (params: any) => {
    const result = await services.project.storyConfigCategoryList(params)
    setCategoryList(result)
    return result
  }

  const getFieldList = async (params: any) => {
    const result = await services.project.storyConfigField(params)
    setFieldList(result)
  }

  const getProjectList = async (params: any) => {
    const result = await services.project.getProjectList(params)
    setProjectList(result)
  }

  const getTagList = async (params: any) => {
    const result = await services.project.getTagList(params)
    setTagList(result)
  }

  const getProjectCoverList = async () => {
    const result = await services.project.getProjectCoverList()
    setCoverList(result)
  }

  const getProjectInfo = async (params: any) => {
    const result = await services.project.getProjectInfo(params)
    setProjectInfo(result)
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
    fieldList,
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
    setFieldList,
  }
}
