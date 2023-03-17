import { getParamsData } from '@/tools'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'

const ProjectWrap = styled.div`
  position: relative;
  height: 100%;
  background: var(--neutral-white-d1);
`
const Project = () => {
  const { projectInfo } = useSelector(store => store.project)
  const [isShowPage, setIsShowPage] = useState(false)
  const [searchParams] = useSearchParams()
  let paramsData: any
  if (
    !(
      String(location.pathname).includes('/ProjectManagement/Mine') ||
      String(location.pathname) === '/ProjectManagement/Project'
    )
  ) {
    paramsData = getParamsData(searchParams)
  }
  const navigate = useNavigate()

  useEffect(() => {
    // 判断如果当前项目是私有项目并且当前登录者不是项目成员则跳转无权限界面
    if (projectInfo?.isPublic === 2 && !projectInfo?.isMember) {
      navigate('/PrivatePermission')
    } else {
      setIsShowPage(true)
    }
  }, [paramsData, projectInfo])

  return <ProjectWrap>{isShowPage && <Outlet />}</ProjectWrap>
}

export default Project
