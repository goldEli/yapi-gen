import styled from '@emotion/styled'
import LeftSide from './components/LeftSide'
import RightTable from './components/RightTable'
import CommonModal from '@/components/CommonModal'
import DeleteConfirm from '@/components/DeleteConfirm'
const Wrap = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 56px);
`
const TeamManagement = () => {
  return (
    <Wrap>
      <LeftSide></LeftSide>
      <RightTable></RightTable>
      <CommonModal isVisible={true} />
    </Wrap>
  )
}

export default TeamManagement
