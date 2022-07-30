import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [projectList, setProjectList] = useState<any>([])
  const [tagList, setTagList] = useState<any>([])
  const [coverList, setCoverList] = useState<any>([])
  const [projectPermission, setProjectPermission] = useState<any>([])
  const [projectInfo, setProjectInfo] = useState<any>({})
  const [memberList, setMemberList] = useState<any>([])
  const [refreshMember, setRefreshMember] = useState(false)
  const [filterAll, setFilterAll] = useState<any>([])

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
    setRefreshMember,
    refreshMember,
    setFilterAll,
    filterAll,
  }
}
