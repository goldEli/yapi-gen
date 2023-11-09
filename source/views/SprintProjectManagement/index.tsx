import React, { useEffect, useState } from 'react'
import HasSideCommonLayout from '@/components/HasSideCommonLayout'
import { ProjectWrap } from './style'
import ProjectDetailSide from './ProjectDetailSide'
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { useDispatch, useSelector } from '@store/index'
import { saveInputKey } from '@store/view'
import { getParamsData } from '@/tools'
import { setActiveCategory } from '@store/category/index'
import { setCategoryList } from '@store/category'
import RightWran from '@/hooks/useRightWran'
import useForewarnModal from '@/hooks/useForewarnModal'

interface IProps {}

const Project: React.FC<IProps> = props => {
  const { ForewarnModal, openForewarnModal } = useForewarnModal()
  const path = [
    '/SprintProjectManagement/KanBan',
    '/SprintProjectManagement/SprintReport',
    '/SprintProjectManagement/Sprint',
    '/SprintProjectManagement/Affair',
    '/SprintProjectManagement/Setting',
    '/SprintProjectManagement/DemandSetting',
    '/SprintProjectManagement/WorkFlow',
    '/SprintProjectManagement/SprintProjectDetail',
    '/SprintProjectManagement/WorkHours',
  ]
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { projectInfo } = useSelector(store => store.project)
  const [isShowPage, setIsShowPage] = useState(false)

  let paramsData: any
  if (
    !(
      String(location.pathname).includes(
        '/ProjectManagement/SiteNotifications',
      ) ||
      String(location.pathname) === '/SprintProjectManagement/Project' ||
      String(location.pathname) === '/SprintProjectManagement'
    )
  ) {
    paramsData = getParamsData(searchParams)
  }
  useEffect(() => {
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
      {isShowPage ? (
        <>
          {window.location.href.includes('/SprintProjectManagement/Setting') ||
          window.location.href.includes('/ProjectManagement/Mine') ||
          window.location.href.includes(
            '/SprintProjectManagement/DemandSetting',
          ) ? null : projectInfo?.project_warring_info?.warring_list_nums ? (
            <RightWran />
          ) : null}
          {window.location.href.includes('/SprintProjectManagement/Setting') ||
          window.location.href.includes('/ProjectManagement/Mine') ||
          window.location.href.includes(
            '/SprintProjectManagement/DemandSetting',
          )
            ? null
            : projectInfo?.project_warring_info?.warring_list_nums
            ? ForewarnModal
            : null}
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
