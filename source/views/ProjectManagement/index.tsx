import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'

const ProjectWrap = styled.div`
  position: relative;
  height: 100%;
  background: var(--neutral-white-d1);
`
const Project = () => {
  return (
    <ProjectWrap>
      <Outlet />
    </ProjectWrap>
  )
}

export default Project
