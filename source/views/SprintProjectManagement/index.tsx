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
interface IProps {}
const Project: React.FC<IProps> = props => {
  const path = [
    '/SprintProjectManagement/KanBan',
    '/SprintProjectManagement/SprintReport',
    '/SprintProjectManagement/Sprint',
    '/SprintProjectManagement/Affair',
    '/SprintProjectManagement/Setting',
    '/SprintProjectManagement/DemandSetting',
    '/SprintProjectManagement/WorkFlow',
    '/SprintProjectManagement/SprintProjectDetail',
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
    // 判断如果当前项目是私有项目并且当前登录者不是项目成员则跳转无权限界面
    if (projectInfo?.isPublic === 2 && !projectInfo?.isMember) {
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
