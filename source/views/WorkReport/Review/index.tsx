import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'
import PermissionWrap from '@/components/PermissionWrap'
import { useSelector } from '@store/index'

const Wrap = styled.div`
  height: 100%;
  display: flex;
  position: relative;
`
const Main = styled.div({
  width: '100%',
  height: '100%',
  overflow: 'auto',
})

const Review = () => {
  const { currentMenu } = useSelector(store => store.user)
  return (
    <PermissionWrap
      auth="/Report/Review"
      permission={currentMenu?.children?.map((i: any) => i.url)}
    >
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
