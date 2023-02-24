import styled from '@emotion/styled'
import { Spin } from 'antd'
import { useState } from 'react'
import LeftSide from './components/LeftSide'
import RightTable from './components/RightTable'
const Wrap = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 56px);
`
const TeamManagement = () => {
  const [isSpinning, setIsSpinning] = useState(false)
  return (
    <Spin spinning={isSpinning}>
      <Wrap>
        <LeftSide isSpin={(value: boolean) => setIsSpinning(value)} />
        <RightTable />
      </Wrap>
    </Spin>
  )
}

export default TeamManagement
