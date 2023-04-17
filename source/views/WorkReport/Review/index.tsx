import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'
import PermissionWrap from '@/components/PermissionWrap'

const Wrap = styled.div`
  height: 100%;
  display: flex;
  position: relative;
`
const Main = styled.div({
  width: '100%',
  overflow: 'auto',
})

const Review = () => {
  return (
    <PermissionWrap auth="/Report/Review" permission={['/Report/Review']}>
      <Wrap>
        {/* 右边的表格 */}
        <Main>
          <Outlet />
        </Main>
      </Wrap>
    </PermissionWrap>
  )
}

export default Review
