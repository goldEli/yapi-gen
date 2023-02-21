import styled from '@emotion/styled'
import HeaderSearch from './HeaderSearch'
import Table from './Table'
import Pagination from './Pagination'
const RightWrap = styled.div`
  width: 100%;
  padding: 0 24px;
  height: 100%;
  position: relative;
`
const PaginationBox = styled.div`
  position: absolute;
  bottom: 0;
  right: 24px;
`
const TableBox = styled.div`
  width: 100%;
  height: calc(100% - 64px - 72px);
  overflow-y: scroll;
`
const RightTable = () => {
  return (
    <RightWrap>
      <HeaderSearch />
      <TableBox>
        <Table />
      </TableBox>
      <PaginationBox>
        <Pagination
          total={100}
          pageSize={20}
          onChange={(page: number, pageSize: number) => 123}
        />
      </PaginationBox>
    </RightWrap>
  )
}
export default RightTable
