import React from 'react'
import HasSideCommonLayout from '@/components/HasSideCommonLayout'
import { ProjectWrap } from './style'
import ProjectDetailSide from './ProjectDetailSide'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
interface IProps {}
const Project: React.FC<IProps> = props => {
  const path = [
    '/SprintProjectManagement/KanBan',
    '/SprintProjectManagement/Report',
    '/SprintProjectManagement/Sprint',
    '/SprintProjectManagement/Affair',
    '/SprintProjectManagement/Setting',
    '/SprintProjectManagement/Demand',
    '/SprintProjectManagement/WorkFlow',
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
