import NewLoadingTransition from '@/components/NewLoadingTransition'
import PermissionWrap from '@/components/PermissionWrap'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { Spin } from 'antd'
import { useState } from 'react'
import LeftSide from './components/LeftSide'
import RightTable from './components/RightTable'

const Wrap = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 56px);
  overflow-y: hidden;
  overflow-x: hidden;
`
const TeamManagement = () => {
  const [isSpinning, setIsSpinning] = useState(false)
  const { menuPermission } = useSelector(store => store.user)

  return (
    <PermissionWrap
      auth="/AdminManagement/TeamManagement"
      permission={menuPermission?.menus
        ?.filter((k: any) => k.url === '/AdminManagement')?.[0]
        ?.children?.map((i: any) => i.url)}
    >
      <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
        <Wrap>
          <LeftSide isSpin={(value: boolean) => setIsSpinning(value)} />
          <RightTable />
        </Wrap>
      </Spin>
    </PermissionWrap>
  )
}

export default TeamManagement
