import styled from '@emotion/styled'
import LeftSide from './components/LeftSide'
import RightTable from './components/RightTable'
const Wrap = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`
const Admin = () => {
  return (
    <Wrap>
      <LeftSide></LeftSide>
      <RightTable></RightTable>
    </Wrap>
  )
}

export default Admin
