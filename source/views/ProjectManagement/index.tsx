import HasSideCommonLayout from '@/components/HasSideCommonLayout'
import { getParamsData } from '@/tools'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { setActiveCategory } from '@store/category/index'
import { setCategoryList } from '@store/category'
import {
  Outlet,
  useNavigate,
  useSearchParams,
  useLocation,
} from 'react-router-dom'
import { useDispatch, useSelector } from '@store/index'
import { saveInputKey } from '@store/view'
import ProjectDetailSide from './ProjectDetailSide'
import RightWran from '@/hooks/useRightWran'
import ProjectWarningModal from '@/components/ProjectWarningModal/ProjectWarningModal'

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
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
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

  const path = [
    '/ProjectManagement/ProjectSetting',
    '/ProjectManagement/Demand',
    '/ProjectManagement/Iteration',
    '/ProjectManagement/KanBan',
    '/ProjectManagement/IterationReport',
    '/ProjectManagement/Defect',
    '/ProjectManagement/WorkFlow',
    '/ProjectManagement/IterationDetail',
    '/ProjectManagement/WorkHours',
  ]

  useEffect(() => {
    if (String(location.pathname).includes('/ProjectManagement/Mine')) {
      setIsShowPage(true)
      return
    }
    // 判断如果当前项目是私有项目并且当前登录者不是项目成员则跳转无权限界面
    if (
      (projectInfo?.isPublic === 2 || projectInfo?.is_public === 2) &&
      !projectInfo?.isMember &&
      !projectInfo?.user_ismember
    ) {
      navigate('/PrivatePermission')
    } else {
      setIsShowPage(true)
    }
  }, [paramsData, projectInfo])
  useEffect(() => {
    dispatch(saveInputKey(''))
  }, [location.pathname])
  useEffect(() => {
    dispatch(setActiveCategory({}))
    dispatch(setCategoryList([]))
  }, [])

  return (
    <ProjectWrap>
      {window.location.href.includes('/ProjectManagement/Project') ||
      window.location.href.includes(
        '/ProjectManagement/Mine',
      ) ? null : projectInfo?.project_warring_info?.warring_list_nums ? (
        <RightWran />
      ) : null}
      {/* {window.location.href.includes('/ProjectManagement/Project') ||
      window.location.href.includes(
        '/ProjectManagement/Mine',
      ) ? null : projectInfo?.project_warring_info?.warring_list_nums ? (
        <ProjectWarningModal></ProjectWarningModal>
      ) : null} */}
      {isShowPage ? (
        <>
          {path.includes(location.pathname) && (
            <HasSideCommonLayout side={<ProjectDetailSide />}>
              <Outlet />
            </HasSideCommonLayout>
          )}
          {!path.includes(location.pathname) && <Outlet />}
        </>
      ) : null}
    </ProjectWrap>
  )
}

export default Project
