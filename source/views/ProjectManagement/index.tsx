import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { getParamsData } from '@/tools'
import styled from '@emotion/styled'
import { useDispatch } from '@store/index'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
import { useEffect, useState } from 'react'
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

const ProjectWrap = styled.div`
  position: relative;
  height: 100%;
  background: var(--neutral-white-d1);
`
const Project = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isProject = pathname === '/ProjectManagement/Project'
  let projectId: any
  const [searchParams] = useSearchParams()
  if (pathname !== '/ProjectManagement/Project') {
    const paramsData = getParamsData(searchParams)
    projectId = paramsData.id
  }
  // 用于私有项目权限过渡
  const [isShowPage, setIsShowPage] = useState(isProject ? true : false)

  const getProjectInfoValuesData = async () => {
    const result = await getProjectInfoValues({ projectId })
    dispatch(setProjectInfoValues(result))
  }

  // 获取项目信息
  const getInfo = async () => {
    const result = await getProjectInfo({ projectId })
    dispatch(setProjectInfo(result))
    // 判断如果当前项目是私有项目并且当前登录者不是项目成员则跳转无权限界面
    if (result.isPublic === 2 && !result.isMember) {
      navigate('/PrivatePermission')
    } else {
      setIsShowPage(true)
    }
  }

  useEffect(() => {
    if (pathname !== '/ProjectManagement/Project') {
      getInfo()
      getProjectInfoValuesData()
    }
  }, [])

  return <ProjectWrap>{isShowPage && <Outlet />}</ProjectWrap>
}

export default Project
