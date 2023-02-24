import styled from '@emotion/styled'
import LeftSide from './components/LeftSide'
import RightTable from './components/RightTable'
const Wrap = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 56px);
`
const TeamManagement = () => {
  return (
    <Wrap>
      <LeftSide />
      <RightTable />
    </Wrap>
  )
}

export default TeamManagement
