import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'

const Wrap = styled.div`
  width: 100%;
  height: calc(100vh - 56px);
`

const Statistics = () => {
  return (
    <Wrap>
      <Outlet />
    </Wrap>
  )
}

export default Statistics
