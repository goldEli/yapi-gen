import styled from '@emotion/styled'
import HeaderSearch from './HeaderSearch'
import Table from './Table'
const RightWrap = styled.div`
  width: 100%;
  padding: 0 24px;
`
const RightTable = () => {
  return (
    <RightWrap>
      <HeaderSearch />
      <Table></Table>
    </RightWrap>
  )
}
export default RightTable
