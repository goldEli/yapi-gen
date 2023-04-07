import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'
import { useSelector } from '@store/index'

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
  const { menuPermission } = useSelector(store => store.user)
  return (
    // <PermissionWrap
    //   auth="/Report"
    //   permission={menuPermission?.menus?.map((i: any) => i.url)}
    // >
    <Wrap>
      {/* 右边的表格 */}
      <Main>
        <Outlet />
      </Main>
    </Wrap>
    // </PermissionWrap>
  )
}

export default Review
