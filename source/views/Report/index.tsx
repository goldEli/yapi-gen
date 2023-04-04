import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'

const ReportWrap = styled.div`
  position: relative;
  height: 100%;
  background: var(--neutral-white-d1);
`
const Report = () => {
  return (
    <ReportWrap>
      <Outlet />
    </ReportWrap>
  )
}
export default Report
