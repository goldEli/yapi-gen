import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'

const WorkReportWrap = styled.div`
  position: relative;
  height: 100%;
  background: var(--neutral-white-d1);
`
const WorkReport = () => {
  return (
    <WorkReportWrap>
      <Outlet />
    </WorkReportWrap>
  )
}

export default WorkReport
