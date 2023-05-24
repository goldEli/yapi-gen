import React, { useEffect } from 'react'
import HasSideCommonLayout from '@/components/HasSideCommonLayout'
import { ProjectWrap } from './style'
import ProjectDetailSide from './ProjectDetailSide'
import { Outlet } from 'react-router-dom'
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
  return (
    <ProjectWrap>
      <>
        {path.includes(location.pathname) && (
          <HasSideCommonLayout side={<ProjectDetailSide />}>
            <Outlet />
          </HasSideCommonLayout>
        )}
        {!path.includes(location.pathname) && <Outlet />}
      </>
    </ProjectWrap>
  )
}
export default Project
