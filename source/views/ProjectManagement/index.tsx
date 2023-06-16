import HasSideCommonLayout from '@/components/HasSideCommonLayout'
import { getParamsData } from '@/tools'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import ProjectDetailSide from './ProjectDetailSide'

const ProjectWrap = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
  background: var(--neutral-white-d1);
`
const Project = () => {
  const { projectInfo } = useSelector(store => store.project)
  const [isShowPage, setIsShowPage] = useState(false)
  const [searchParams] = useSearchParams()
  let paramsData: any
  if (
    !(
      String(location.pathname).includes(
        '/ProjectManagement/SiteNotifications',
      ) ||
      String(location.pathname).includes('/ProjectManagement/Mine') ||
      String(location.pathname) === '/ProjectManagement/Project' ||
      String(location.pathname) === '/ProjectManagement'
    )
  ) {
    paramsData = getParamsData(searchParams)
  }
  const navigate = useNavigate()

  const path = [
    '/ProjectManagement/ProjectSetting',
    '/ProjectManagement/Demand',
    '/ProjectManagement/Iteration',
    '/ProjectManagement/KanBan',
    '/ProjectManagement/IterationReport',
    '/ProjectManagement/Defect',
    '/ProjectManagement/WorkFlow',
    '/ProjectManagement/DemandDetail',
    '/ProjectManagement/IterationDetail',
    '/ProjectManagement/DefectDetail',
  ]

  useEffect(() => {
    if (String(location.pathname).includes('/ProjectManagement/Mine')) {
      setIsShowPage(true)
      return
    }
    // 判断如果当前项目是私有项目并且当前登录者不是项目成员则跳转无权限界面
    if (projectInfo?.isPublic === 2 && !projectInfo?.isMember) {
      navigate('/PrivatePermission')
    } else {
      setIsShowPage(true)
    }
  }, [paramsData, projectInfo])
  return (
    <ProjectWrap>
      {isShowPage && (
        <>
          {path.includes(location.pathname) && (
            <HasSideCommonLayout side={<ProjectDetailSide />}>
              <Outlet />
            </HasSideCommonLayout>
          )}
          {!path.includes(location.pathname) && <Outlet />}
        </>
      )}
    </ProjectWrap>
  )
}

export default Project
