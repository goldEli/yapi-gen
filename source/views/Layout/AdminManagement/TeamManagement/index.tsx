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
  height: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  .ant-spin-container {
    display: flex;
  }
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
      <Wrap>
        <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
          <LeftSide isSpin={(value: boolean) => setIsSpinning(value)} />
          <RightTable />
        </Spin>
      </Wrap>
    </PermissionWrap>
  )
}

export default TeamManagement
